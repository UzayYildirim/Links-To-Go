const config = {
    // VALIDATION: Configuration validation settings
    validation: {
        enabled: true // Enable or disable configuration validation error display
    },

    // QUICK START: Edit these values to personalize your page
    profile: {
        title: "John Doe's Links",
        image: "https://i.ibb.co/NgJ8m336/male-default-avatar-profile-gray-picture-grey-photo-placeholder-gray-profile-anonymous-face-picture.jpg",
        bio: "A curated collection of interesting links",
        description: {
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. © 2025.",
            style: {
                enabled: true,
                opacity: 0.7,
                fontSize: '14px',
                marginTop: '40px'
            }
        }
    },

    // LINKS: Add your links here
    links: [
        {
            title: "Photography Portfolio",
            description: "Capturing moments in time",
            extend: "Explore my collection of landscape and portrait photography. Each image tells a story of the world around us, frozen in a single moment. From urban landscapes to natural wonders, my lens seeks to capture the extraordinary in the ordinary.",
            urls: [
                {
                    title: "Personal Portfolio",
                    url: "https://example.com/photos"
                },
                {
                    title: "Instagram",
                    url: "https://instagram.com/example"
                }
            ],
            // url: "https://example.com/photos",
            color: "#FF6B6B",
            icon: "fas fa-camera-retro",
            index: 1
        },
        {
            title: "Tech Blog",
            description: "Insights & tutorials",
            extend: "Deep dives into technology, programming, and digital innovation. Regular posts about software development, AI, and the future of tech.",
            url: "https://example.com/blog",
            color: "#4ECDC4",
            icon: "fas fa-laptop-code",
            index: 2
        },
        {
            title: "Digital Art Gallery",
            url: "https://example.com/art",
            color: "#9B89B3",
            icon: "fas fa-palette",
            index: 3
        },
        {
            title: "Music Playlist",
            description: "My favorite tracks",
            url: "https://example.com/music",
            color: "#45B7D1",
            icon: "fas fa-headphones-alt",
            index: 4
        },
        {
            title: "Travel Blog",
            description: "Adventures around the world",
            extend: "Join me on my journey across continents. From hidden gems in bustling cities to serene natural landscapes, I share travel tips, cultural insights, and unforgettable experiences.",
            url: "https://example.com/travel",
            color: "#96CEB4",
            icon: "fas fa-globe-americas",
            index: 5
        },
        {
            title: "Podcast",
            description: "Weekly discussions",
            url: "https://example.com/podcast",
            color: "#D4A373",
            icon: "fas fa-microphone-alt",
            index: 6
        }
    ],

    // SEO Configuration
    seo: {
        // Keywords are automatically generated from link titles but you can add more
        additionalKeywords: ["portfolio", "personal page", "contact"],
        // Override the auto-generated description if needed
        customDescription: "", // Leave empty to use auto-generated
        // Social media images (leave empty to use profile image)
        images: {
            og: "", // Open Graph
            twitter: "" // Twitter (X)
        },
        // Social media handles
        social: {
            twitter: "@johndoe" // Twitter (X) handle
        },
        // Additional meta tags
        meta: [
            {
                name: "theme-color",
                content: "#4158D0"
            }
            // Add any additional meta tags here
        ]
    },

    // THEME: Customize the look and feel
    theme: {
        fonts: {
            titles: "'Montserrat', sans-serif",
            descriptions: "'Calibri', sans-serif"
        },
        topButton: {
            enabled: true,
            showAfter: 20, // pixels scrolled
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
                color: '#FFFFFF'
            }
        },
        background: {
            type: 'gradient', // Options: 'gradient' or 'image'
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
            linksText: "Open Links",
            visitText: "Go to Site"
        }
    },

    // TYPOGRAPHY: Adjust font sizes (in pixels)
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

    // ANIMATIONS: Configure page animations
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
    },
}; 

// Links To Go by Uzay Yildirim - Open Source Link In Bio Tool - https://uzay.me