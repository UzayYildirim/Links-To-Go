const validateConfig = (config) => {
    const errors = [];
    const warnings = [];

    const addError = (path, message, suggestion = null) => {
        errors.push({ path, message, suggestion });
    };

    const addWarning = (path, message, suggestion = null) => {
        warnings.push({ path, message, suggestion });
    };

    const validateType = (value, expectedType, path) => {
        if (value === null || value === undefined) return false;
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        return actualType === expectedType;
    };

    const validateRequired = (value, path, type, allowEmpty = false) => {
        if (value === null || value === undefined) {
            addError(path, `is required`, `Add a value for ${path}`);
            return false;
        }
        if (type === 'string' && !allowEmpty && typeof value === 'string' && value.trim() === '') {
            addError(path, `cannot be empty`, `Provide a non-empty string value`);
            return false;
        }
        if (type && !validateType(value, type, path)) {
            addError(path, `must be a ${type}`, `Expected ${type}, got ${Array.isArray(value) ? 'array' : typeof value}`);
            return false;
        }
        return true;
    };

    const validateOptional = (value, path, type, validator) => {
        if (value === null || value === undefined) return true;
        if (type && !validateType(value, type, path)) {
            addError(path, `must be a ${type}`, `Expected ${type}, got ${Array.isArray(value) ? 'array' : typeof value}`);
            return false;
        }
        if (validator) {
            return validator(value, path);
        }
        return true;
    };

    const validateUrl = (url, path, allowRelative = false) => {
        if (!url || typeof url !== 'string') return false;
        
        if (allowRelative && (url.startsWith('/') || url.startsWith('./') || url.startsWith('../'))) {
            return true;
        }
        
        if (url.startsWith('data:')) {
            return true;
        }
        
        if (url.startsWith('//')) {
            return true;
        }
        
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const validateColor = (color, path) => {
        if (!color || typeof color !== 'string') return false;
        
        const trimmed = color.trim();
        
        const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        const rgbPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)$/i;
        const hslPattern = /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+\s*)?\)$/i;
        const cssVarPattern = /^var\(--[\w-]+\)$/;
        
        const namedColors = ['transparent', 'inherit', 'initial', 'unset', 'currentColor'];
        
        return hexPattern.test(trimmed) || 
               rgbPattern.test(trimmed) || 
               hslPattern.test(trimmed) ||
               cssVarPattern.test(trimmed) ||
               namedColors.includes(trimmed.toLowerCase());
    };

    const validateCssLength = (value, path) => {
        if (!value || typeof value !== 'string') return false;
        const trimmed = value.trim();
        const lengthPattern = /^-?\d+(\.\d+)?(px|em|rem|%|vh|vw|vmin|vmax|pt|pc|in|cm|mm|ex|ch)$/i;
        const zeroPattern = /^0(px|em|rem|%)?$/i;
        return lengthPattern.test(trimmed) || zeroPattern.test(trimmed);
    };

    const validateCssTime = (value, path) => {
        if (!value || typeof value !== 'string') return false;
        const trimmed = value.trim();
        const timePattern = /^\d+(\.\d+)?(s|ms)$/i;
        return timePattern.test(trimmed);
    };

    const validateOpacity = (value, path) => {
        if (typeof value !== 'number') return false;
        return value >= 0 && value <= 1;
    };

    if (!config || typeof config !== 'object') {
        addError('root', 'Config must be an object', 'Ensure config.js exports a valid config object');
        return { errors, warnings, valid: false };
    }

    validateOptional(config.validation, 'validation', 'object', (value, path) => {
        if (value && !validateType(value, 'object', path)) {
            return false;
        }
        if (value && value.enabled !== undefined && typeof value.enabled !== 'boolean') {
            addError(`${path}.enabled`, 'must be a boolean', 'Use true or false');
            return false;
        }
        return true;
    });

    if (!validateRequired(config.profile, 'profile', 'object')) {
        return { errors, warnings, valid: false };
    }

    if (config.profile) {
        validateRequired(config.profile.title, 'profile.title', 'string', false);
        
        validateOptional(config.profile.image, 'profile.image', 'string', (value, path) => {
            if (value && value.trim() && !validateUrl(value, path, true)) {
                addWarning(path, 'should be a valid URL', 'Use a full URL (https://...) or relative path');
            }
            return true;
        });

        validateOptional(config.profile.bio, 'profile.bio', 'string');

        if (config.profile.description) {
            if (!validateType(config.profile.description, 'object', 'profile.description')) {
                addError('profile.description', 'must be an object', 'Use an object: { text: "...", style: {...} }');
            } else {
                validateOptional(config.profile.description.text, 'profile.description.text', 'string');
                
                if (config.profile.description.style) {
                    if (!validateType(config.profile.description.style, 'object', 'profile.description.style')) {
                        addError('profile.description.style', 'must be an object', 'Use an object with style properties');
                    } else {
                        validateOptional(config.profile.description.style.enabled, 'profile.description.style.enabled', 'boolean');
                        
                        validateOptional(config.profile.description.style.background, 'profile.description.style.background', 'string', (value, path) => {
                            if (value && !validateColor(value, path)) {
                                addWarning(path, 'should be a valid color', 'Use hex (#FF0000), rgb/rgba, hsl/hsla, or named color');
                            }
                            return true;
                        });
                        
                        validateOptional(config.profile.description.style.padding, 'profile.description.style.padding', 'string', (value, path) => {
                            if (value && !validateCssLength(value, path)) {
                                addWarning(path, 'should be a valid CSS length', 'Use values like "20px", "1em", "2rem", etc.');
                            }
                            return true;
                        });
                        
                        validateOptional(config.profile.description.style.borderRadius, 'profile.description.style.borderRadius', 'string', (value, path) => {
                            if (value && !validateCssLength(value, path)) {
                                addWarning(path, 'should be a valid CSS length', 'Use values like "12px", "0.5rem", etc.');
                            }
                            return true;
                        });
                        
                        validateOptional(config.profile.description.style.backdropBlur, 'profile.description.style.backdropBlur', 'string', (value, path) => {
                            if (value && !validateCssLength(value, path)) {
                                addWarning(path, 'should be a valid CSS length', 'Use values like "10px", "0.5rem", etc.');
                            }
                            return true;
                        });
                        
                        validateOptional(config.profile.description.style.border, 'profile.description.style.border', 'string');
                    }
                }
            }
        }

        if (config.profile.footer) {
            if (!validateType(config.profile.footer, 'object', 'profile.footer')) {
                addError('profile.footer', 'must be an object', 'Use an object: { text: "...", style: {...} }');
            } else {
                validateOptional(config.profile.footer.text, 'profile.footer.text', 'string');
                
                if (config.profile.footer.style) {
                    if (!validateType(config.profile.footer.style, 'object', 'profile.footer.style')) {
                        addError('profile.footer.style', 'must be an object', 'Use an object with style properties');
                    } else {
                        validateOptional(config.profile.footer.style.enabled, 'profile.footer.style.enabled', 'boolean');
                        
                        validateOptional(config.profile.footer.style.opacity, 'profile.footer.style.opacity', 'number', (value, path) => {
                            if (value !== null && value !== undefined && !validateOpacity(value, path)) {
                                addError(path, 'must be between 0 and 1', 'Use a number between 0 (transparent) and 1 (opaque)');
                                return false;
                            }
                            return true;
                        });
                        
                        validateOptional(config.profile.footer.style.fontSize, 'profile.footer.style.fontSize', 'string', (value, path) => {
                            if (value && !validateCssLength(value, path)) {
                                addWarning(path, 'should be a valid CSS length', 'Use values like "14px", "0.875rem", etc.');
                            }
                            return true;
                        });
                        
                        validateOptional(config.profile.footer.style.marginTop, 'profile.footer.style.marginTop', 'string', (value, path) => {
                            if (value && !validateCssLength(value, path)) {
                                addWarning(path, 'should be a valid CSS length', 'Use values like "40px", "2.5rem", etc.');
                            }
                            return true;
                        });
                    }
                }
            }
        }
    }

    if (!validateRequired(config.links, 'links', 'array')) {
        return { errors, warnings, valid: false };
    }

    if (config.links && Array.isArray(config.links)) {
        if (config.links.length === 0) {
            addWarning('links', 'array is empty - no links will be displayed', 'Add at least one link object to the links array');
        }
        
        config.links.forEach((link, index) => {
            const linkPath = `links[${index}]`;
            
            if (!validateType(link, 'object', linkPath)) {
                addError(linkPath, 'must be an object', 'Each link must be an object with title, index, and url/urls');
                return;
            }

            validateRequired(link.title, `${linkPath}.title`, 'string', false);
            
            validateRequired(link.index, `${linkPath}.index`, 'number', false);
            
            if (typeof link.index === 'number' && (link.index < 1 || !Number.isInteger(link.index))) {
                addWarning(`${linkPath}.index`, 'should be a positive integer starting from 1', 'Use values like 1, 2, 3, etc.');
            }

            validateOptional(link.description, `${linkPath}.description`, 'string');
            validateOptional(link.extend, `${linkPath}.extend`, 'string');
            
            validateOptional(link.color, `${linkPath}.color`, 'string', (value, path) => {
                if (value && !validateColor(value, path)) {
                    addWarning(path, 'should be a valid color', 'Use hex (#FF6B6B), rgb/rgba, hsl/hsla, or named color');
                }
                return true;
            });
            
            validateOptional(link.icon, `${linkPath}.icon`, 'string', (value, path) => {
                if (value && !value.trim().match(/^(fas|far|fal|fab|fa)\s+fa-[\w-]+$/)) {
                    addWarning(path, 'should be a valid FontAwesome icon class', 'Use format like "fas fa-link" or "fab fa-github"');
                }
                return true;
            });

            if (link.url && link.urls) {
                addError(`${linkPath}`, 'cannot have both "url" and "urls" properties', 'Use either "url" for a single link or "urls" for multiple links');
            }

            if (!link.url && !link.urls && !link.extend) {
                addWarning(`${linkPath}`, 'has no url, urls, or extend property', 'Add either "url", "urls", or "extend" to make this link functional');
            }

            validateOptional(link.url, `${linkPath}.url`, 'string', (value, path) => {
                if (value && !validateUrl(value, path, false)) {
                    addError(path, 'must be a valid URL', 'Use a full URL starting with http:// or https://');
                }
                return true;
            });

            if (link.urls) {
                if (!validateType(link.urls, 'array', `${linkPath}.urls`)) {
                    addError(`${linkPath}.urls`, 'must be an array', 'Use an array: [{ title: "...", url: "..." }, ...]');
                } else if (link.urls.length === 0) {
                    addWarning(`${linkPath}.urls`, 'is empty', 'Add at least one URL object with title and url properties');
                } else {
                    link.urls.forEach((urlItem, urlIndex) => {
                        const urlPath = `${linkPath}.urls[${urlIndex}]`;
                        if (!validateType(urlItem, 'object', urlPath)) {
                            addError(urlPath, 'must be an object', 'Use an object: { title: "...", url: "..." }');
                        } else {
                            validateRequired(urlItem.title, `${urlPath}.title`, 'string', false);
                            validateRequired(urlItem.url, `${urlPath}.url`, 'string', false);
                            if (urlItem.url && !validateUrl(urlItem.url, `${urlPath}.url`, false)) {
                                addError(`${urlPath}.url`, 'must be a valid URL', 'Use a full URL starting with http:// or https://');
                            }
                        }
                    });
                }
            }
        });

        const indices = config.links.map(link => link.index).filter(idx => typeof idx === 'number');
        const duplicates = indices.filter((idx, i) => indices.indexOf(idx) !== i);
        if (duplicates.length > 0) {
            addError('links', `duplicate indices found: ${[...new Set(duplicates)].join(', ')}`, 'Each link must have a unique index number');
        }
        
        const sortedIndices = [...indices].sort((a, b) => a - b);
        if (sortedIndices.length > 0 && sortedIndices[0] !== 1) {
            addWarning('links', 'indices should start from 1', 'Consider starting your link indices from 1');
        }
    }

    if (config.seo) {
        if (!validateType(config.seo, 'object', 'seo')) {
            addError('seo', 'must be an object', 'Use an object with seo properties');
        } else {
            validateOptional(config.seo.additionalKeywords, 'seo.additionalKeywords', 'array', (value, path) => {
                if (value && !value.every(item => typeof item === 'string')) {
                    addError(path, 'must be an array of strings', 'Use an array like: ["keyword1", "keyword2"]');
                    return false;
                }
                return true;
            });

            validateOptional(config.seo.customDescription, 'seo.customDescription', 'string');

            if (config.seo.images) {
                if (!validateType(config.seo.images, 'object', 'seo.images')) {
                    addError('seo.images', 'must be an object', 'Use an object: { og: "...", twitter: "..." }');
                } else {
                    validateOptional(config.seo.images.og, 'seo.images.og', 'string', (value, path) => {
                        if (value && !validateUrl(value, path, true)) {
                            addWarning(path, 'should be a valid URL', 'Use a full URL (https://...) for Open Graph images');
                        }
                        return true;
                    });
                    validateOptional(config.seo.images.twitter, 'seo.images.twitter', 'string', (value, path) => {
                        if (value && !validateUrl(value, path, true)) {
                            addWarning(path, 'should be a valid URL', 'Use a full URL (https://...) for Twitter card images');
                        }
                        return true;
                    });
                }
            }

            if (config.seo.social) {
                if (!validateType(config.seo.social, 'object', 'seo.social')) {
                    addError('seo.social', 'must be an object', 'Use an object: { twitter: "@username" }');
                } else {
                    validateOptional(config.seo.social.twitter, 'seo.social.twitter', 'string', (value, path) => {
                        if (value && !value.startsWith('@') && value.trim() !== '') {
                            addWarning(path, 'Twitter handle should start with @', 'Use format: "@username"');
                        }
                        return true;
                    });
                }
            }

            validateOptional(config.seo.meta, 'seo.meta', 'array', (value, path) => {
                if (value && !value.every(item => validateType(item, 'object', path))) {
                    addError(path, 'must be an array of objects', 'Use an array: [{ name: "...", content: "..." }, ...]');
                    return false;
                }
                return true;
            });
        }
    }

    if (config.theme) {
        if (!validateType(config.theme, 'object', 'theme')) {
            addError('theme', 'must be an object', 'Use an object with theme properties');
        } else {
            if (config.theme.fonts) {
                if (!validateType(config.theme.fonts, 'object', 'theme.fonts')) {
                    addError('theme.fonts', 'must be an object', 'Use an object: { titles: "...", descriptions: "..." }');
                } else {
                    validateOptional(config.theme.fonts.titles, 'theme.fonts.titles', 'string');
                    validateOptional(config.theme.fonts.descriptions, 'theme.fonts.descriptions', 'string');
                }
            }

            if (config.theme.topButton) {
                if (!validateType(config.theme.topButton, 'object', 'theme.topButton')) {
                    addError('theme.topButton', 'must be an object', 'Use an object with topButton properties');
                } else {
                    validateOptional(config.theme.topButton.enabled, 'theme.topButton.enabled', 'boolean');
                    
                    validateOptional(config.theme.topButton.showAfter, 'theme.topButton.showAfter', 'number', (value, path) => {
                        if (value !== null && value !== undefined && (value < 0 || !Number.isInteger(value))) {
                            addWarning(path, 'should be a non-negative integer', 'Use a number like 20, 50, 100, etc.');
                        }
                        return true;
                    });
                    
                    if (config.theme.topButton.size) {
                        if (!validateType(config.theme.topButton.size, 'object', 'theme.topButton.size')) {
                            addError('theme.topButton.size', 'must be an object', 'Use an object: { desktop: "40px", mobile: "35px" }');
                        } else {
                            validateOptional(config.theme.topButton.size.desktop, 'theme.topButton.size.desktop', 'string', (value, path) => {
                                if (value && !validateCssLength(value, path)) {
                                    addWarning(path, 'should be a valid CSS length', 'Use values like "40px", "2.5rem", etc.');
                                }
                                return true;
                            });
                            validateOptional(config.theme.topButton.size.mobile, 'theme.topButton.size.mobile', 'string', (value, path) => {
                                if (value && !validateCssLength(value, path)) {
                                    addWarning(path, 'should be a valid CSS length', 'Use values like "35px", "2.1875rem", etc.');
                                }
                                return true;
                            });
                        }
                    }

                    if (config.theme.topButton.position) {
                        if (!validateType(config.theme.topButton.position, 'object', 'theme.topButton.position')) {
                            addError('theme.topButton.position', 'must be an object', 'Use an object: { bottom: "20px", right: "20px" }');
                        } else {
                            validateOptional(config.theme.topButton.position.bottom, 'theme.topButton.position.bottom', 'string', (value, path) => {
                                if (value && !validateCssLength(value, path)) {
                                    addWarning(path, 'should be a valid CSS length', 'Use values like "20px", "1.25rem", etc.');
                                }
                                return true;
                            });
                            validateOptional(config.theme.topButton.position.right, 'theme.topButton.position.right', 'string', (value, path) => {
                                if (value && !validateCssLength(value, path)) {
                                    addWarning(path, 'should be a valid CSS length', 'Use values like "20px", "1.25rem", etc.');
                                }
                                return true;
                            });
                        }
                    }

                    if (config.theme.topButton.style) {
                        if (!validateType(config.theme.topButton.style, 'object', 'theme.topButton.style')) {
                            addError('theme.topButton.style', 'must be an object', 'Use an object with style properties');
                        } else {
                            validateOptional(config.theme.topButton.style.background, 'theme.topButton.style.background', 'string', (value, path) => {
                                if (value && !validateColor(value, path)) {
                                    addWarning(path, 'should be a valid color', 'Use hex, rgb/rgba, hsl/hsla, or named color');
                                }
                                return true;
                            });
                            validateOptional(config.theme.topButton.style.hoverBackground, 'theme.topButton.style.hoverBackground', 'string', (value, path) => {
                                if (value && !validateColor(value, path)) {
                                    addWarning(path, 'should be a valid color', 'Use hex, rgb/rgba, hsl/hsla, or named color');
                                }
                                return true;
                            });
                            validateOptional(config.theme.topButton.style.color, 'theme.topButton.style.color', 'string', (value, path) => {
                                if (value && !validateColor(value, path)) {
                                    addWarning(path, 'should be a valid color', 'Use hex, rgb/rgba, hsl/hsla, or named color');
                                }
                                return true;
                            });
                        }
                    }
                }
            }

            if (config.theme.background) {
                if (!validateType(config.theme.background, 'object', 'theme.background')) {
                    addError('theme.background', 'must be an object', 'Use an object with background properties');
                } else {
                    validateOptional(config.theme.background.type, 'theme.background.type', 'string', (value, path) => {
                        if (value && !['gradient', 'image'].includes(value)) {
                            addError(path, 'must be either "gradient" or "image"', 'Use either "gradient" or "image"');
                        }
                        return true;
                    });

                    if (config.theme.background.type === 'image' && config.theme.background.image) {
                        if (!config.theme.background.image.url || config.theme.background.image.url.trim() === '') {
                            addWarning('theme.background.image.url', 'should be provided when type is "image"', 'Add a URL for the background image');
                        }
                    }

                    if (config.theme.background.type === 'gradient' && config.theme.background.gradient) {
                        if (!config.theme.background.gradient.colors || config.theme.background.gradient.colors.length === 0) {
                            addWarning('theme.background.gradient.colors', 'should be provided when type is "gradient"', 'Add at least one color to the gradient');
                        }
                    }

                    if (config.theme.background.image) {
                        if (!validateType(config.theme.background.image, 'object', 'theme.background.image')) {
                            addError('theme.background.image', 'must be an object', 'Use an object: { url: "...", blur: "...", overlay: "..." }');
                        } else {
                            validateOptional(config.theme.background.image.url, 'theme.background.image.url', 'string', (value, path) => {
                                if (value && !validateUrl(value, path, true)) {
                                    addWarning(path, 'should be a valid URL', 'Use a full URL (https://...) or relative path');
                                }
                                return true;
                            });
                            validateOptional(config.theme.background.image.blur, 'theme.background.image.blur', 'string', (value, path) => {
                                if (value && !validateCssLength(value, path)) {
                                    addWarning(path, 'should be a valid CSS length', 'Use values like "10px", "0.625rem", etc.');
                                }
                                return true;
                            });
                            validateOptional(config.theme.background.image.overlay, 'theme.background.image.overlay', 'string', (value, path) => {
                                if (value && !validateColor(value, path)) {
                                    addWarning(path, 'should be a valid color', 'Use hex, rgb/rgba, hsl/hsla, or named color');
                                }
                                return true;
                            });
                        }
                    }

                    if (config.theme.background.gradient) {
                        if (!validateType(config.theme.background.gradient, 'object', 'theme.background.gradient')) {
                            addError('theme.background.gradient', 'must be an object', 'Use an object: { colors: [...], angle: 25, animationDuration: "30s" }');
                        } else {
                            validateOptional(config.theme.background.gradient.colors, 'theme.background.gradient.colors', 'array', (value, path) => {
                                if (value && (!Array.isArray(value) || value.length === 0)) {
                                    addError(path, 'must be a non-empty array', 'Add at least one color: ["#4158D0"]');
                                } else if (value && !value.every(color => validateColor(color, path))) {
                                    addError(path, 'must contain valid color values', 'Use hex (#FF0000), rgb/rgba, hsl/hsla, or named colors');
                                }
                                return true;
                            });
                            validateOptional(config.theme.background.gradient.angle, 'theme.background.gradient.angle', 'number', (value, path) => {
                                if (value !== null && value !== undefined && (value < 0 || value > 360)) {
                                    addWarning(path, 'should be between 0 and 360', 'Use a number between 0 and 360 degrees');
                                }
                                return true;
                            });
                            validateOptional(config.theme.background.gradient.animationDuration, 'theme.background.gradient.animationDuration', 'string', (value, path) => {
                                if (value && !validateCssTime(value, path)) {
                                    addWarning(path, 'should be a valid CSS time value', 'Use values like "30s", "1.5s", "500ms", etc.');
                                }
                                return true;
                            });
                        }
                    }
                }
            }

            if (config.theme.shadows) {
                if (!validateType(config.theme.shadows, 'object', 'theme.shadows')) {
                    addError('theme.shadows', 'must be an object', 'Use an object with shadow properties');
                } else {
                    validateOptional(config.theme.shadows.enabled, 'theme.shadows.enabled', 'boolean');
                    
                    if (config.theme.shadows.elements) {
                        if (!validateType(config.theme.shadows.elements, 'object', 'theme.shadows.elements')) {
                            addError('theme.shadows.elements', 'must be an object', 'Use an object with elements properties');
                        } else {
                            if (config.theme.shadows.elements.buttons) {
                                if (!validateType(config.theme.shadows.elements.buttons, 'object', 'theme.shadows.elements.buttons')) {
                                    addError('theme.shadows.elements.buttons', 'must be an object', 'Use an object with button shadow properties');
                                } else {
                                    validateOptional(config.theme.shadows.elements.buttons.enabled, 'theme.shadows.elements.buttons.enabled', 'boolean');
                                    validateOptional(config.theme.shadows.elements.buttons.default, 'theme.shadows.elements.buttons.default', 'string');
                                    validateOptional(config.theme.shadows.elements.buttons.hover, 'theme.shadows.elements.buttons.hover', 'string');
                                }
                            }

                            if (config.theme.shadows.elements.text) {
                                if (!validateType(config.theme.shadows.elements.text, 'object', 'theme.shadows.elements.text')) {
                                    addError('theme.shadows.elements.text', 'must be an object', 'Use an object with text shadow properties');
                                } else {
                                    validateOptional(config.theme.shadows.elements.text.enabled, 'theme.shadows.elements.text.enabled', 'boolean');
                                    validateOptional(config.theme.shadows.elements.text.title, 'theme.shadows.elements.text.title', 'string');
                                    validateOptional(config.theme.shadows.elements.text.bio, 'theme.shadows.elements.text.bio', 'string');
                                    validateOptional(config.theme.shadows.elements.text.buttons, 'theme.shadows.elements.text.buttons', 'string');
                                }
                            }
                        }
                    }
                }
            }

            if (config.theme.buttons) {
                if (!validateType(config.theme.buttons, 'object', 'theme.buttons')) {
                    addError('theme.buttons', 'must be an object', 'Use an object: { linksText: "...", visitText: "..." }');
                } else {
                    validateOptional(config.theme.buttons.linksText, 'theme.buttons.linksText', 'string');
                    validateOptional(config.theme.buttons.visitText, 'theme.buttons.visitText', 'string');
                }
            }
        }
    }

    if (config.typography) {
        if (!validateType(config.typography, 'object', 'typography')) {
            addError('typography', 'must be an object', 'Use an object with typography properties');
        } else {
            ['desktop', 'mobile'].forEach(breakpoint => {
                if (config.typography[breakpoint]) {
                    if (!validateType(config.typography[breakpoint], 'object', `typography.${breakpoint}`)) {
                        addError(`typography.${breakpoint}`, 'must be an object', 'Use an object with font size properties');
                    } else {
                        validateOptional(config.typography[breakpoint].title, `typography.${breakpoint}.title`, 'string', (value, path) => {
                            if (value && !validateCssLength(value, path)) {
                                addWarning(path, 'should be a valid CSS length', 'Use values like "32px", "2rem", etc.');
                            }
                            return true;
                        });
                        validateOptional(config.typography[breakpoint].bio, `typography.${breakpoint}.bio`, 'string', (value, path) => {
                            if (value && !validateCssLength(value, path)) {
                                addWarning(path, 'should be a valid CSS length', 'Use values like "20px", "1.25rem", etc.');
                            }
                            return true;
                        });
                        validateOptional(config.typography[breakpoint].description, `typography.${breakpoint}.description`, 'string', (value, path) => {
                            if (value && !validateCssLength(value, path)) {
                                addWarning(path, 'should be a valid CSS length', 'Use values like "16px", "1rem", etc.');
                            }
                            return true;
                        });
                        
                        if (config.typography[breakpoint].button) {
                            if (!validateType(config.typography[breakpoint].button, 'object', `typography.${breakpoint}.button`)) {
                                addError(`typography.${breakpoint}.button`, 'must be an object', 'Use an object: { title: "...", description: "..." }');
                            } else {
                                validateOptional(config.typography[breakpoint].button.title, `typography.${breakpoint}.button.title`, 'string', (value, path) => {
                                    if (value && !validateCssLength(value, path)) {
                                        addWarning(path, 'should be a valid CSS length', 'Use values like "18px", "1.125rem", etc.');
                                    }
                                    return true;
                                });
                                validateOptional(config.typography[breakpoint].button.description, `typography.${breakpoint}.button.description`, 'string', (value, path) => {
                                    if (value && !validateCssLength(value, path)) {
                                        addWarning(path, 'should be a valid CSS length', 'Use values like "14px", "0.875rem", etc.');
                                    }
                                    return true;
                                });
                            }
                        }
                    }
                }
            });
        }
    }

    if (config.animations) {
        if (!validateType(config.animations, 'object', 'animations')) {
            addError('animations', 'must be an object', 'Use an object with animation properties');
        } else {
            validateOptional(config.animations.enabled, 'animations.enabled', 'boolean');
            
            if (config.animations.elements) {
                if (!validateType(config.animations.elements, 'object', 'animations.elements')) {
                    addError('animations.elements', 'must be an object', 'Use an object with element animation properties');
                } else {
                    const validAnimationTypes = ['fade-in', 'slide-up', 'scale-in', 'zoom-in', 'rotate-in', 'flip-in', 'bounce-in', 'fade-out', 'slide-down', 'scale-out', 'zoom-out', 'rotate-out', 'flip-out', 'bounce-out'];
                    
                    ['profile', 'title', 'bio', 'description', 'buttons'].forEach(element => {
                        if (config.animations.elements[element]) {
                            if (!validateType(config.animations.elements[element], 'object', `animations.elements.${element}`)) {
                                addError(`animations.elements.${element}`, 'must be an object', 'Use an object: { type: "...", duration: "...", delay: "..." }');
                            } else {
                                validateOptional(config.animations.elements[element].type, `animations.elements.${element}.type`, 'string', (value, path) => {
                                    if (value && !validAnimationTypes.includes(value)) {
                                        addWarning(path, `should be one of: ${validAnimationTypes.join(', ')}`, `Use one of the valid animation types: ${validAnimationTypes.slice(0, 3).join(', ')}, etc.`);
                                    }
                                    return true;
                                });
                                validateOptional(config.animations.elements[element].duration, `animations.elements.${element}.duration`, 'string', (value, path) => {
                                    if (value && !validateCssTime(value, path)) {
                                        addWarning(path, 'should be a valid CSS time value', 'Use values like "1s", "0.8s", "500ms", etc.');
                                    }
                                    return true;
                                });
                                validateOptional(config.animations.elements[element].delay, `animations.elements.${element}.delay`, 'string', (value, path) => {
                                    if (value && !validateCssTime(value, path) && !validateCssLength(value, path)) {
                                        addWarning(path, 'should be a valid CSS time or length value', 'Use values like "0.2s", "200ms", etc.');
                                    }
                                    return true;
                                });
                                validateOptional(config.animations.elements[element].staggerDelay, `animations.elements.${element}.staggerDelay`, 'number', (value, path) => {
                                    if (value !== null && value !== undefined && (value < 0 || typeof value !== 'number')) {
                                        addWarning(path, 'should be a non-negative number', 'Use values like 0.1, 0.2, 0.5, etc.');
                                    }
                                    return true;
                                });
                            }
                        }
                    });
                }
            }
        }
    }

    return {
        errors,
        warnings,
        valid: errors.length === 0
    };
};

const displayValidationErrors = (validationResult, config) => {
    const validationEnabled = config?.validation?.enabled !== false;
    
    if (!validationEnabled) {
        if (validationResult.errors.length > 0) {
            console.error('Configuration validation failed (display disabled):', validationResult.errors);
        }
        if (validationResult.warnings.length > 0) {
            console.warn('Configuration warnings (display disabled):', validationResult.warnings);
        }
        return;
    }

    if (validationResult.valid && validationResult.warnings.length === 0) {
        return;
    }

    const errorContainer = document.createElement('div');
    errorContainer.id = 'config-validation-errors';
    errorContainer.setAttribute('role', 'alert');
    errorContainer.setAttribute('aria-live', 'assertive');
    const backgroundColor = validationResult.errors.length > 0 ? '#ff4444' : '#ff9800';
    errorContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: ${backgroundColor};
        color: white;
        padding: 20px;
        padding-right: 60px;
        z-index: 10000;
        max-height: 80vh;
        overflow-y: auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        line-height: 1.6;
    `;

    const title = document.createElement('h2');
    title.textContent = validationResult.errors.length > 0 ? 'Configuration Errors' : 'Configuration Warnings';
    title.style.cssText = 'margin: 0 0 15px 0; font-size: 20px; font-weight: 600;';
    errorContainer.appendChild(title);

    if (validationResult.errors.length > 0) {
        const errorList = document.createElement('ul');
        errorList.style.cssText = 'margin: 0 0 20px 0; padding-left: 25px; list-style-type: disc;';
        
        validationResult.errors.forEach(({ path, message, suggestion }) => {
            const li = document.createElement('li');
            li.style.cssText = 'margin-bottom: 10px; line-height: 1.6;';
            const pathSpan = document.createElement('strong');
            pathSpan.textContent = `${path}: `;
            pathSpan.style.cssText = 'font-weight: 600;';
            li.appendChild(pathSpan);
            li.appendChild(document.createTextNode(message));
            if (suggestion) {
                const suggestionDiv = document.createElement('div');
                suggestionDiv.textContent = `💡 ${suggestion}`;
                suggestionDiv.style.cssText = 'margin-top: 4px; margin-left: 20px; font-size: 14px; opacity: 0.9; font-style: italic;';
                li.appendChild(suggestionDiv);
            }
            errorList.appendChild(li);
        });
        
        errorContainer.appendChild(errorList);
    }

    if (validationResult.warnings.length > 0) {
        const warningTitle = document.createElement('h3');
        warningTitle.textContent = 'Warnings';
        warningTitle.style.cssText = 'margin: 20px 0 10px 0; font-size: 16px; font-weight: 600; opacity: 0.95;';
        errorContainer.appendChild(warningTitle);

        const warningList = document.createElement('ul');
        warningList.style.cssText = 'margin: 0; padding-left: 25px; list-style-type: disc; opacity: 0.95;';
        
        validationResult.warnings.forEach(({ path, message, suggestion }) => {
            const li = document.createElement('li');
            li.style.cssText = 'margin-bottom: 10px; line-height: 1.6;';
            const pathSpan = document.createElement('strong');
            pathSpan.textContent = `${path}: `;
            pathSpan.style.cssText = 'font-weight: 600;';
            li.appendChild(pathSpan);
            li.appendChild(document.createTextNode(message));
            if (suggestion) {
                const suggestionDiv = document.createElement('div');
                suggestionDiv.textContent = `💡 ${suggestion}`;
                suggestionDiv.style.cssText = 'margin-top: 4px; margin-left: 20px; font-size: 14px; opacity: 0.9; font-style: italic;';
                li.appendChild(suggestionDiv);
            }
            warningList.appendChild(li);
        });
        
        errorContainer.appendChild(warningList);
    }

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', 'Close validation errors');
    closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 28px;
        width: 35px;
        height: 35px;
        cursor: pointer;
        border-radius: 4px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
    `;
    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.background = 'rgba(255, 255, 255, 0.3)';
    });
    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    closeButton.addEventListener('click', () => {
        errorContainer.remove();
    });
    errorContainer.appendChild(closeButton);

    document.body.insertBefore(errorContainer, document.body.firstChild);

    if (validationResult.errors.length > 0) {
        console.error('Configuration validation failed:', validationResult.errors);
    }
    if (validationResult.warnings.length > 0) {
        console.warn('Configuration warnings:', validationResult.warnings);
    }
};
