const config = {
    // QUICK START: Edit these values to personalize your page
    profile: {
        title: "My Links", // Change this to your desired title
        image: "", // Add your profile image URL here
        bio: "", // Short bio or tagline
        description: {
            text: "", // Brief description about yourself or the page
            style: {
                enabled: true, // Enable or disable custom styling for the description
                background: 'rgba(0, 0, 0, 0.2)', // Background color for description box
                padding: '20px', // Padding inside the description box
                borderRadius: '12px', // Rounded corners for the description box
                backdropBlur: '10px', // Blur effect for the background
                border: '1px solid rgba(255, 255, 255, 0.1)' // Border styling
            }
        },
        footer: {
            text: "", // Footer text, e.g your copyright info or a personal note
            style: {
                enabled: true, // Enable or disable footer styling
                opacity: 0.7, // Opacity of the footer text
                fontSize: '14px', // Font size of the footer text
                marginTop: '40px' // Space above the footer
            }
        }
    },

    // LINKS: Add your links here
    links: [
        // EXAMPLE:
        // {
        //     title: "Example Link", // Required - The main title of the link
        //     description: "An example of a complete link configuration", // Optional - A short description displayed below the title
        //     extend: "This section provides more details about the link.", // Optional - An extended description providing additional details. When populated, button will be an accordion.
        //     urls: [ // Optional - Convert this link button into an accordion. When clicked, it will expand to show a description and a button that displays all the defined links. This feature is unavailable if the "url" option is enabled.
        //         {
        //             title: "Sub-link 1", // Title of the first sub-link
        //             url: "https://example.com/sub1" // URL of the first sub-link
        //         },
        //         {
        //             title: "Sub-link 2", // Title of the second sub-link
        //             url: "https://example.com/sub2" // URL of the second sub-link
        //         }
        //     ],
        //     url: "https://example.com", // Optional - The main URL for this link. This option is unavailable if the "urls" option is enabled.
        //     color: "#FF6B6B", // Optional -Background color for the link button
        //     icon: "fas fa-link", // Optinal - FontAwesome icon class for the link
        //     index: 1 // Required - Position of the link in the list (starting from 1)
        // }
    ],

    // SEO Configuration
    seo: {
        additionalKeywords: [], // Optional - Add extra keywords for search optimization. Links To Go automatically generates keywords from the link titles, these are just in case you need to add more.
        customDescription: "", // Optional - Override auto-generated descriptions if needed. Links To Go automatically generates descriptions from the link titles, these are just in case you need to override the defaults.
        images: {
            og: "", // Optional - Open Graph image (for social sharing)
            twitter: "" // Optional - Twitter (X) card image
        },
        social: {
            twitter: "" // Your Twitter (X) handle
        },
        meta: [] // Optional - Add any extra meta tags here
    },

    // THEME: Customize the look and feel
    theme: {
        fonts: {
            titles: "'Montserrat', sans-serif", // Font for titles
            descriptions: "'Calibri', sans-serif" // Font for descriptions
        },
        topButton: {
            enabled: true, // Show a "back to top" button
            showAfter: 20, // Pixels scrolled before showing button
            size: {
                desktop: '40px', // Button size on desktop
                mobile: '35px' // Button size on mobile
            },
            position: {
                bottom: '20px', // Distance from the bottom
                right: '20px' // Distance from the right
            },
            style: {
                background: 'rgba(255, 255, 255, 0.15)', // Default background color
                hoverBackground: 'rgba(255, 255, 255, 0.25)', // Background color on hover
                color: 'white' // Text/icon color
            }
        },
        background: {
            type: 'gradient', // Options: 'gradient' or 'image'
            image: {
                url: '', // Background image URL (if type is 'image')
                blur: '10px', // Blur effect for the background image
                overlay: 'rgba(0, 0, 0, 0.3)' // Overlay color for background image
            },
            gradient: {
                colors: ['#4158D0', '#C850C0', '#FFCC70'], // Gradient colors. Use HEX values. Define 1 color for a solid background. Define more colors for a gradient background.
                angle: 25, // Angle of gradient direction
                animationDuration: '30s' // Duration of gradient animation
            }
        },
        shadows: {
            enabled: true, // Enable or disable shadows in the page
            elements: {
                buttons: {
                    enabled: true, // Enable button shadows
                    default: '0 4px 15px rgba(0, 0, 0, 0.1)', // Default shadow for buttons
                    hover: '0 8px 25px rgba(0, 0, 0, 0.2)' // Shadow on hover for buttons
                },
                text: {
                    enabled: true, // Enable text shadows
                    title: '2px 2px 4px rgba(0, 0, 0, 0.2)', // Shadow for titles
                    bio: '1px 1px 3px rgba(0, 0, 0, 0.15)', // Shadow for bio text
                    buttons: '1px 1px 2px rgba(0, 0, 0, 0.3)' // Shadow for button text
                }
            }
        },
        buttons: {
            linksText: "Open Links", // Text for opening links popup, when the button is an accordion with multiple links.
            visitText: "Go to Site" // Text for visiting links, when the button is a single link but has a extended description.
        }
    },

    // TYPOGRAPHY: Adjust font sizes (in pixels)
    typography: {
        desktop: {
            title: '32px', // Font size for title on desktop
            bio: '20px', // Font size for bio on desktop
            description: '16px', // Font size for description on desktop
            button: {
                title: '18px', // Font size for button titles
                description: '14px' // Font size for button descriptions
            }
        },
        mobile: {
            title: '28px', // Font size for title on mobile
            bio: '18px', // Font size for bio on mobile
            description: '15px', // Font size for description on mobile
            button: {
                title: '16px', // Font size for button titles on mobile
                description: '13px' // Font size for button descriptions on mobile
            }
        }
    },

    // ANIMATIONS: Configure page animations. Available animations: fade-in, slide-up, scale-in, zoom-in, rotate-in, flip-in, bounce-in, fade-out, slide-down, scale-out, zoom-out, rotate-out, flip-out, bounce-out.
    animations: {
        enabled: true, // Enable or disable animations
        elements: {
            profile: {
                type: 'fade-in', // Animation type for profile section
                duration: '1s', // Animation duration
                delay: '0.2s' // Delay before animation starts
            },
            title: {
                type: 'slide-up', // Animation type for title
                duration: '1s',
                delay: '0.4s'
            },
            bio: {
                type: 'slide-up', // Animation type for bio
                duration: '1s',
                delay: '0.6s'
            },
            description: {
                type: 'slide-up', // Animation type for description
                duration: '1s',
                delay: '0.8s'
            },
            buttons: {
                type: 'scale-in', // Animation type for buttons
                duration: '0.8s',
                staggerDelay: 0.2 // Staggered animation delay for multiple buttons
            }
        }
    }
};

// Links To Go by Uzay Yildirim - Open Source Link In Bio Tool - https://uzay.me
