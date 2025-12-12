const { createApp } = Vue;

const animationTypes = ['fade-in', 'slide-up', 'scale-in', 'zoom-in', 'rotate-in', 'flip-in', 'bounce-in', 'fade-out', 'slide-down', 'scale-out', 'zoom-out', 'rotate-out', 'flip-out', 'bounce-out'];
const animationKeys = ['profile', 'title', 'bio', 'description', 'buttons'];
const siteFiles = ['index.html', 'main.js', 'styles.css', 'validation.js', 'favicon.ico', 'README.md', 'LICENSE'];
const binaryExt = ['.ico', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
const fontOptions = [
    "'Inter', system-ui, -apple-system, sans-serif",
    "'Montserrat', sans-serif",
    "'Poppins', sans-serif",
    "'Nunito', sans-serif",
    "'Space Grotesk', sans-serif",
    "'Playfair Display', serif",
    "'Roboto', sans-serif",
    "'Fira Sans', sans-serif"
];
const gradientPresets = [
    { label: 'Aurora', colors: ['#4158D0', '#C850C0', '#FFCC70'], angle: 25 },
    { label: 'Sunset', colors: ['#ff9a9e', '#fad0c4', '#fad0c4'], angle: 145 },
    { label: 'Mojito', colors: ['#3ca55c', '#b5ac49', '#e2d810'], angle: 90 },
    { label: 'Ocean', colors: ['#0f2027', '#203a43', '#2c5364'], angle: 120 }
];
const linkColorPalette = ['#5c7cfa', '#22d3ee', '#34d399', '#f472b6', '#f97316', '#facc15', '#8b5cf6'];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const normalizeHex = (value = '#000000') => {
    if (typeof value !== 'string') return '#000000';
    if (value.startsWith('#')) {
        const hex = value.length === 4
            ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
            : value.slice(0, 7);
        return /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : '#000000';
    }
    const rgbaMatch = value.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
    if (rgbaMatch) {
        const [r, g, b] = rgbaMatch.slice(1, 4).map((n) => clamp(parseInt(n, 10) || 0, 0, 255));
        return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
    }
    return '#000000';
};

const alphaFromRgba = (value = '') => {
    const match = value.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([0-9.]+)\s*\)/i);
    if (match) return clamp(parseFloat(match[1]) || 0, 0, 1);
    return 1;
};

const buildOverlay = (color, alpha) => {
    const hex = normalizeHex(color);
    const int = parseInt(hex.slice(1), 16);
    const r = (int >> 16) & 255;
    const g = (int >> 8) & 255;
    const b = int & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const parseOverlay = (value) => ({
    color: normalizeHex(value),
    alpha: alphaFromRgba(value)
});

const parsePx = (value, fallback = 0) => {
    const num = parseFloat(value);
    return Number.isFinite(num) ? num : fallback;
};

const isBinaryFile = (path) => binaryExt.some(ext => path.toLowerCase().endsWith(ext));

const template = {
    validation: { enabled: true },
    profile: {
        title: 'My Links',
        image: '',
        bio: '',
        description: {
            text: '',
            style: {
                enabled: true,
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '20px',
                borderRadius: '12px',
                backdropBlur: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }
        },
        footer: {
            text: '',
            style: {
                enabled: true,
                opacity: 0.7,
                fontSize: '14px',
                marginTop: '40px'
            }
        }
    },
    links: [],
    seo: {
        additionalKeywords: [],
        customDescription: '',
        images: {
            og: '',
            twitter: ''
        },
        social: {
            twitter: ''
        },
        meta: []
    },
    theme: {
        fonts: {
            titles: "'Montserrat', sans-serif",
            descriptions: "'Calibri', sans-serif"
        },
        topButton: {
            enabled: true,
            showAfter: 20,
            size: {
                desktop: '40px',
                mobile: '35px'
            },
            position: {
                bottom: '20px',
                right: '20px'
            },
            style: {
                background: 'rgba(255, 255, 255, 0.15)',
                hoverBackground: 'rgba(255, 255, 255, 0.25)',
                color: 'white'
            }
        },
        background: {
            type: 'gradient',
            image: {
                url: '',
                blur: '10px',
                overlay: 'rgba(0, 0, 0, 0.3)'
            },
            gradient: {
                colors: ['#4158D0', '#C850C0', '#FFCC70'],
                angle: 25,
                animationDuration: '30s'
            }
        },
        shadows: {
            enabled: true,
            elements: {
                buttons: {
                    enabled: true,
                    default: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    hover: '0 8px 25px rgba(0, 0, 0, 0.2)'
                },
                text: {
                    enabled: true,
                    title: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                    bio: '1px 1px 3px rgba(0, 0, 0, 0.15)',
                    buttons: '1px 1px 2px rgba(0, 0, 0, 0.3)'
                }
            }
        },
        buttons: {
            linksText: 'Open Links',
            visitText: 'Go to Site'
        }
    },
    typography: {
        desktop: {
            title: '32px',
            bio: '20px',
            description: '16px',
            button: {
                title: '18px',
                description: '14px'
            }
        },
        mobile: {
            title: '28px',
            bio: '18px',
            description: '15px',
            button: {
                title: '16px',
                description: '13px'
            }
        }
    },
    animations: {
        enabled: true,
        elements: {
            profile: {
                type: 'fade-in',
                duration: '1s',
                delay: '0.2s'
            },
            title: {
                type: 'slide-up',
                duration: '1s',
                delay: '0.4s'
            },
            bio: {
                type: 'slide-up',
                duration: '1s',
                delay: '0.6s'
            },
            description: {
                type: 'slide-up',
                duration: '1s',
                delay: '0.8s'
            },
            buttons: {
                type: 'scale-in',
                duration: '0.8s',
                staggerDelay: 0.2
            }
        }
    }
};

const deepClone = (obj) => JSON.parse(JSON.stringify(obj || {}));

const mergeTemplate = (base, source) => {
    if (Array.isArray(base)) {
        return Array.isArray(source) ? deepClone(source) : [];
    }
    if (typeof base === 'object' && base !== null) {
        const out = {};
        const keys = new Set([...Object.keys(base), ...Object.keys(source || {})]);
        keys.forEach((key) => {
            out[key] = mergeTemplate(base[key], source ? source[key] : undefined);
        });
        return out;
    }
    return source !== undefined ? source : base;
};

const sourceConfig = () => {
    if (typeof window !== 'undefined' && window.config) return window.config;
    if (typeof config !== 'undefined') return config;
    return template;
};

const normalized = () => mergeTemplate(template, sourceConfig());

createApp({
    data() {
        const initial = normalized();
        const overlayPicker = parseOverlay(initial.theme.background.image.overlay);
        return {
            workingConfig: initial,
            validation: { errors: [], warnings: [], valid: true },
            keywordDraft: '',
            metaJson: initial.seo.meta.map((m) => JSON.stringify(m, null, 2)),
            accentMode: 'dark',
            validateTimer: null,
            overlayPicker,
            imageBlurValue: parsePx(initial.theme.background.image.blur, 10),
            gradientPresets,
            linkColorPalette,
            fontOptions
        };
    },
    computed: {
        sortedLinks() {
            return [...this.workingConfig.links].sort((a, b) => (a.index || 0) - (b.index || 0));
        },
        previewBackground() {
            const bg = this.workingConfig.theme.background;
            if (bg.type === 'gradient') {
                const colors = bg.gradient.colors.length ? bg.gradient.colors : ['#4158D0', '#C850C0'];
                const angle = bg.gradient.angle || 25;
                return {
                    backgroundImage: `linear-gradient(${angle}deg, ${colors.join(', ')})`
                };
            }
            return {
                backgroundImage: bg.image.url ? `url('${bg.image.url}')` : 'linear-gradient(120deg,#1f2937,#0f172a)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            };
        },
        previewOverlay() {
            const img = this.workingConfig.theme.background.image;
            return {
                background: img.overlay || 'rgba(0,0,0,0.3)',
                backdropFilter: img.blur ? `blur(${img.blur})` : 'none'
            };
        },
        previewFonts() {
            return {
                fontFamily: this.workingConfig.theme.fonts.descriptions
            };
        },
        previewTitleStyle() {
            return {
                fontFamily: this.workingConfig.theme.fonts.titles,
                fontSize: this.workingConfig.typography.desktop.title,
                textShadow: this.workingConfig.theme.shadows.elements.text.title
            };
        },
        previewBioStyle() {
            return {
                fontSize: this.workingConfig.typography.desktop.bio,
                textShadow: this.workingConfig.theme.shadows.elements.text.bio
            };
        },
        previewDescriptionStyle() {
            const style = this.workingConfig.profile.description.style;
            return {
                fontSize: this.workingConfig.typography.desktop.description,
                background: style.enabled ? style.background : 'transparent',
                padding: style.enabled ? style.padding : '0',
                borderRadius: style.enabled ? style.borderRadius : '0',
                backdropFilter: style.enabled ? `blur(${style.backdropBlur || '0'})` : 'none',
                border: style.enabled ? style.border : 'none'
            };
        },
        previewFooterStyle() {
            const style = this.workingConfig.profile.footer.style;
            return {
                fontSize: style.fontSize,
                marginTop: style.marginTop,
                opacity: style.opacity
            };
        }
    },
    methods: {
        setLinkMode(link, mode) {
            if (mode === 'single') {
                link.urls = [];
                if (!link.url) link.url = '';
            } else if (mode === 'multi') {
                link.url = '';
                if (!Array.isArray(link.urls)) link.urls = [];
                if (!link.urls.length) link.urls.push({ title: '', url: '' });
            } else {
                link.url = '';
                link.urls = [];
            }
        },
        linkMode(link) {
            if (link.urls && link.urls.length) return 'multi';
            if (link.url) return 'single';
            return 'accordion';
        },
        normalizeHexUi(value) {
            return normalizeHex(value);
        },
        linkModeLabel(link) {
            const mode = this.linkMode(link);
            if (mode === 'single') return 'Single link';
            if (mode === 'multi') return 'Multi link set';
            return 'Accordion note';
        },
        applyGradientPreset(preset) {
            if (!preset || !preset.colors) return;
            this.workingConfig.theme.background.type = 'gradient';
            this.workingConfig.theme.background.gradient.colors = deepClone(preset.colors);
            if (preset.angle !== undefined) {
                this.workingConfig.theme.background.gradient.angle = preset.angle;
            }
        },
        addLink() {
            const nextIndex = (this.workingConfig.links.length || 0) + 1;
            this.workingConfig.links.push({
                title: 'New Link',
                description: '',
                extend: '',
                url: '',
                urls: [],
                color: '#5c7cfa',
                icon: 'fas fa-link',
                index: nextIndex
            });
        },
        removeLink(idx) {
            this.workingConfig.links.splice(idx, 1);
        },
        duplicateLink(link) {
            const copy = deepClone(link);
            copy.index = (this.workingConfig.links.length || 0) + 1;
            this.workingConfig.links.push(copy);
        },
        setLinkColor(link, color) {
            link.color = color;
        },
        addSubLink(link) {
            if (!Array.isArray(link.urls)) link.urls = [];
            link.urls.push({ title: '', url: '' });
            link.url = '';
        },
        removeSubLink(link, index) {
            link.urls.splice(index, 1);
        },
        addGradientColor() {
            this.workingConfig.theme.background.gradient.colors.push('#ffffff');
        },
        removeGradient(idx) {
            this.workingConfig.theme.background.gradient.colors.splice(idx, 1);
        },
        updateImageBlur(value) {
            const amount = Math.max(0, parseInt(value, 10) || 0);
            this.imageBlurValue = amount;
            this.workingConfig.theme.background.image.blur = `${amount}px`;
        },
        updateOverlayColor(value) {
            const alpha = this.overlayPicker.alpha;
            this.overlayPicker = { color: value, alpha };
            this.workingConfig.theme.background.image.overlay = buildOverlay(value, alpha);
        },
        updateOverlayAlpha(value) {
            const alpha = clamp(parseFloat(value) || 0, 0, 1);
            this.overlayPicker = { color: this.overlayPicker.color, alpha };
            this.workingConfig.theme.background.image.overlay = buildOverlay(this.overlayPicker.color, alpha);
        },
        addKeyword() {
            const value = this.keywordDraft.trim();
            if (!value) return;
            if (!this.workingConfig.seo.additionalKeywords.includes(value)) {
                this.workingConfig.seo.additionalKeywords.push(value);
            }
            this.keywordDraft = '';
        },
        removeKeyword(idx) {
            this.workingConfig.seo.additionalKeywords.splice(idx, 1);
        },
        addMeta() {
            this.workingConfig.seo.meta.push({});
            this.metaJson.push('{}');
        },
        removeMeta(idx) {
            this.workingConfig.seo.meta.splice(idx, 1);
            this.metaJson.splice(idx, 1);
        },
        updateMeta(idx) {
            const raw = this.metaJson[idx];
            try {
                const parsed = JSON.parse(raw);
                this.workingConfig.seo.meta.splice(idx, 1, parsed);
            } catch (e) {
                return;
            }
        },
        runValidation() {
            this.validation = validateConfig(this.workingConfig);
        },
        resetFromSource() {
            const base = normalized();
            this.workingConfig = base;
            this.metaJson = base.seo.meta.map((m) => JSON.stringify(m, null, 2));
            this.overlayPicker = parseOverlay(base.theme.background.image.overlay);
            this.imageBlurValue = parsePx(base.theme.background.image.blur, 10);
            this.runValidation();
        },
        copyJson() {
            const text = JSON.stringify(this.workingConfig, null, 2);
            if (navigator.clipboard?.writeText) {
                navigator.clipboard.writeText(text);
            }
        },
        downloadJson() {
            const text = JSON.stringify(this.workingConfig, null, 2);
            const blob = new Blob([text], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'config.js.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },
        buildConfigContent() {
            const body = JSON.stringify(this.workingConfig, null, 4);
            return `const config = ${body};\n\n// Links To Go by Uzay Yildirim - Open Source Link In Bio Tool - https://uzay.me\n`;
        },
        async downloadFullZip() {
            const zip = new JSZip();
            const tasks = siteFiles.map(async (path) => {
                if (path === 'config.js') return;
                const res = await fetch(`../${path}`);
                if (!res.ok) return;
                if (isBinaryFile(path)) {
                    const buf = await res.arrayBuffer();
                    zip.file(path, buf);
                } else {
                    const txt = await res.text();
                    zip.file(path, txt);
                }
            });
            await Promise.all(tasks);
            zip.file('config.js', this.buildConfigContent());
            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'links-to-go.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },
        toggleAccent() {
            this.accentMode = this.accentMode === 'dark' ? 'light' : 'dark';
        },
        linkStyle(link) {
            const color = link.color || '#5c7cfa';
            const shadows = this.workingConfig.theme.shadows.elements.buttons;
            const textShadows = this.workingConfig.theme.shadows.elements.text;
            return {
                background: `${color}dd`,
                boxShadow: shadows.enabled ? shadows.default : 'none',
                textShadow: textShadows.enabled ? textShadows.buttons : 'none',
                fontFamily: this.workingConfig.theme.fonts.titles
            };
        }
    },
    mounted() {
        this.runValidation();
    },
    watch: {
        workingConfig: {
            handler() {
                if (this.validateTimer) clearTimeout(this.validateTimer);
                this.validateTimer = setTimeout(this.runValidation, 200);
            },
            deep: true
        }
    }
}).mount('#app');
