// Helper function to set CSS variables
const setCSSVariable = (name, value) => {
    document.documentElement.style.setProperty(`--${name}`, value);
};

// Helper function to apply animations
const applyAnimation = (element, config) => {
    if (!element || !config.animations.enabled) return;
    
    // Get animation config based on element id
    let animConfig;
    if (element.id === 'profileImage') {
        animConfig = config.animations.elements.profile;
    } else if (element.id === 'pageTitle') {
        animConfig = config.animations.elements.title;
    } else {
        animConfig = config.animations.elements[element.id];
    }
    
    if (!animConfig) return;

    element.style.setProperty('--animation-duration', animConfig.duration);
    element.style.setProperty('--animation-delay', animConfig.delay);
    element.classList.add('animate', animConfig.type);
};

// Apply basic profile configuration
document.getElementById('pageTitle').textContent = config.profile.title;
document.title = config.profile.title;
document.body.style.fontFamily = config.theme.fonts.descriptions;
setCSSVariable('title-font', config.theme.fonts.titles);
setCSSVariable('description-font', config.theme.fonts.descriptions);

// Handle profile image
const profileImage = document.getElementById('profileImage');
if (config.profile.image?.trim()) {
    profileImage.src = config.profile.image;
    profileImage.style.display = 'inline-block';
} else {
    profileImage.style.display = 'none';
}

// Handle bio text
document.getElementById('bio').textContent = config.profile.bio;

// Handle description
const descriptionElement = document.getElementById('description');
if (config.profile.description.text?.trim()) {
    descriptionElement.textContent = config.profile.description.text;
    descriptionElement.style.display = 'block';
    
    // Apply description styling
    if (config.profile.description.style.enabled) {
        const style = config.profile.description.style;
        setCSSVariable('description-bg', style.background);
        setCSSVariable('description-padding', style.padding);
        setCSSVariable('description-radius', style.borderRadius);
        setCSSVariable('description-backdrop-filter', `blur(${style.backdropBlur})`);
        setCSSVariable('description-border', style.border);
    }
} else {
    descriptionElement.style.display = 'none';
}

// Handle footer
const footerElement = document.getElementById('footer');
if (config.profile.footer?.text?.trim()) {
    footerElement.textContent = config.profile.footer.text;
    footerElement.style.display = 'block';
    
    // Apply footer styling if enabled
    if (config.profile.footer.style.enabled) {
        const style = config.profile.footer.style;
        setCSSVariable('footer-size', style.fontSize);
        setCSSVariable('footer-margin-top', style.marginTop);
        setCSSVariable('footer-opacity', style.opacity);
    }

    // Add animation for footer
    if (config.animations.enabled) {
        footerElement.style.setProperty('--animation-duration', '1s');
        footerElement.style.setProperty('--animation-delay', '1.2s');
        footerElement.classList.add('animate', 'fade-in');
    } else {
        footerElement.style.opacity = 1;
    }
} else {
    footerElement.style.display = 'none';
}

// Apply background
const bg = config.theme.background;
if (bg.type === 'image') {
    document.body.classList.remove('gradient-bg');
    // Set up background image with optional blur
    document.body.style.backgroundImage = `
        linear-gradient(${bg.image.overlay}, ${bg.image.overlay}),
        url('${bg.image.url}')
    `;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    
    // Apply blur if specified
    if (bg.image.blur && bg.image.blur !== '0px') {
        setCSSVariable('bg-blur', bg.image.blur);
    }
} else if (bg.type === 'gradient') {
    document.body.classList.add('gradient-bg');
    // Apply gradient background
    document.body.style.backgroundImage = `linear-gradient(
        ${bg.gradient.angle}deg,
        ${bg.gradient.colors[0]},
        ${bg.gradient.colors[1]},
        ${bg.gradient.colors[2]},
        ${bg.gradient.colors[0]}
    )`;
    setCSSVariable('animation-duration', bg.gradient.animationDuration);
}

// Create and append link buttons
const linksContainer = document.getElementById('linksContainer');
config.links.sort((a, b) => a.index - b.index).forEach((link, index) => {
    const linkButton = document.createElement('a');
    linkButton.href = link.extend ? 'javascript:void(0)' : link.url;
    linkButton.className = 'link-button';
    linkButton.style.backgroundColor = `${link.color}dd`;
    if (!link.extend) {
        linkButton.target = '_blank';
        linkButton.rel = 'noopener noreferrer';
    }

    // Create main content
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';
    mainContent.innerHTML = `
        <i class="${link.icon}"></i>
        <div class="text-container">
            <span class="link-title">${link.title}</span>
            ${link.description ? `<span class="link-description">${link.description}</span>` : ''}
        </div>
        ${link.extend ? `<i class="fas fa-chevron-down toggle-extend"></i>` : ''}
    `;

    linkButton.appendChild(mainContent);

    // Add extend content if available
    if (link.extend) {
        const extendContent = document.createElement('div');
        extendContent.className = 'extend-content';
        extendContent.textContent = link.extend;
        linkButton.appendChild(extendContent);

        // Add click handler
        linkButton.addEventListener('click', (e) => {
            e.preventDefault();
            linkButton.classList.toggle('extended');
        });

        // Add external link at the bottom of extended content
        if (link.url) {
            const externalLink = document.createElement('a');
            externalLink.href = link.url;
            externalLink.target = '_blank';
            externalLink.rel = 'noopener noreferrer';
            externalLink.className = 'external-link';
            externalLink.innerHTML = `
                <i class="fas fa-external-link-alt"></i>
                Visit
            `;
            extendContent.appendChild(externalLink);
        }
    }
    
    linksContainer.appendChild(linkButton);
});

// Apply typography
const typography = config.typography;
Object.entries(typography.desktop).forEach(([key, value]) => {
    if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
            setCSSVariable(`${key}-${subKey}-size`, subValue);
        });
    } else {
        setCSSVariable(`${key}-size`, value);
    }
});

Object.entries(typography.mobile).forEach(([key, value]) => {
    if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
            setCSSVariable(`${key}-${subKey}-size`, subValue);
        });
    } else {
        setCSSVariable(`${key}-size`, value);
    }
});

// Apply shadows
const shadows = config.theme.shadows;
if (shadows.enabled) {
    if (shadows.elements.buttons.enabled) {
        setCSSVariable('button-shadow', shadows.elements.buttons.default);
        setCSSVariable('button-shadow-hover', shadows.elements.buttons.hover);
    }
    if (shadows.elements.text.enabled) {
        setCSSVariable('title-text-shadow', shadows.elements.text.title);
        setCSSVariable('bio-text-shadow', shadows.elements.text.bio);
        setCSSVariable('button-text-shadow', shadows.elements.text.buttons);
    }
}

// Apply animations
if (config.animations.enabled) {
    ['profileImage', 'pageTitle', 'bio', 'description'].forEach(id => {
        applyAnimation(document.getElementById(id), config);
    });

    // Button animations with stagger
    document.querySelectorAll('.link-button').forEach((button, index) => {
        button.style.setProperty('--animation-duration', config.animations.elements.buttons.duration);
        button.style.setProperty('--animation-delay', 
            `${(config.animations.elements.buttons.staggerDelay * (index + 1))}s`);
        button.classList.add('animate', config.animations.elements.buttons.type);
    });
} else {
    document.querySelectorAll('.animate').forEach(element => {
        element.style.opacity = 1;
    });
}

// Handle "Go to top" button
const topButton = document.getElementById('topButton');
if (config.theme.topButton.enabled) {
    // Apply button styling
    const btnStyle = config.theme.topButton;
    setCSSVariable('top-button-size', btnStyle.size.desktop);
    setCSSVariable('top-button-mobile-size', btnStyle.size.mobile);
    setCSSVariable('top-button-bottom', btnStyle.position.bottom);
    setCSSVariable('top-button-right', btnStyle.position.right);
    setCSSVariable('top-button-bg', btnStyle.style.background);
    setCSSVariable('top-button-hover-bg', btnStyle.style.hoverBackground);
    setCSSVariable('top-button-color', btnStyle.style.color);

    // Initial check for scroll position
    if (window.scrollY > btnStyle.showAfter) {
        topButton.classList.add('visible');
    }

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > btnStyle.showAfter) {
            topButton.classList.add('visible');
        } else {
            topButton.classList.remove('visible');
        }
    });

    // Smooth scroll to top when clicked
    topButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
} else {
    topButton.style.visibility = 'hidden';
}

// Handle SEO meta tags
const updateMetaTags = () => {
    const url = window.location.href;
    const title = config.profile.title;
    const personName = title.replace("'s Links", "").trim();
    const description = config.seo.customDescription || 
        `${config.profile.bio} - ${config.links.map(link => link.title).join(', ')}`;
    const image = config.profile.image;
    
    // Generate keywords from links and additional keywords
    const linkKeywords = config.links.map(link => {
        return [link.title, link.description].filter(Boolean);
    }).flat();
    const keywords = [...new Set([...linkKeywords, ...config.seo.additionalKeywords])].join(', ');

    // Update basic meta
    document.getElementById('pageMetaTitle').textContent = title;
    document.getElementById('pageMetaDescription').content = description;
    
    // Update profile image alt text
    document.getElementById('profileImage').alt = `Profile Picture of ${personName}`;
    
    // Update OG meta
    document.getElementById('pageMetaUrl').content = url;
    document.getElementById('pageMetaOgTitle').content = title;
    document.getElementById('pageMetaOgDescription').content = description;
    document.getElementById('pageMetaOgImage').content = config.seo.images.og || image;
    
    // Update Twitter meta
    document.getElementById('pageMetaTwitterUrl').content = url;
    document.getElementById('pageMetaTwitterTitle').content = title;
    document.getElementById('pageMetaTwitterDescription').content = description;
    document.getElementById('pageMetaTwitterImage').content = config.seo.images.twitter || image;
    document.getElementById('pageMetaTwitterCreator').content = config.seo.social.twitter || '';
    
    // Update canonical URL
    document.getElementById('pageCanonicalUrl').href = url;

    // Add dynamic meta tags
    const metaContainer = document.getElementById('additionalMetaTags');
    metaContainer.innerHTML = ''; // Clear existing tags
    
    // Add author meta
    const authorMeta = document.createElement('meta');
    authorMeta.name = 'author';
    authorMeta.content = personName;
    metaContainer.appendChild(authorMeta);

    // Add keywords meta
    const keywordsMeta = document.createElement('meta');
    keywordsMeta.name = 'keywords';
    keywordsMeta.content = keywords;
    metaContainer.appendChild(keywordsMeta);

    // Add additional meta tags from config
    config.seo.meta.forEach(meta => {
        const metaTag = document.createElement('meta');
        Object.entries(meta).forEach(([key, value]) => {
            metaTag[key] = value;
        });
        metaContainer.appendChild(metaTag);
    });

    // Update Schema.org markup
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": {
            "@type": "Person",
            "name": personName,
            "url": url,
            "image": image,
            "description": config.profile.bio,
            "sameAs": config.links.map(link => link.url)
        }
    };
    document.getElementById('schemaMarkup').textContent = JSON.stringify(schemaData, null, 2);
};

// Call updateMetaTags after all content is loaded
window.addEventListener('load', updateMetaTags);

// Links To Go by Uzay Yildirim - Open Source Link In Bio Tool - https://uzay.me