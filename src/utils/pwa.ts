// PWA utilities for service worker registration and installation

export const registerSW = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('SW registered:', registration);
                })
                .catch((error) => {
                    console.log('SW registration failed:', error);
                });
        });
    }
};

// Handle PWA install prompt
type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;

window.addEventListener('beforeinstallprompt', (e: Event) => {
    // Prevent the mini-infobar from appearing on mobile
    (e as BeforeInstallPromptEvent).preventDefault?.();
    // Stash the event so it can be triggered later
    deferredPrompt = e as BeforeInstallPromptEvent;
});

export const promptInstall = async () => {
    if (!deferredPrompt) {
        return false;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // Clear the deferredPrompt
    deferredPrompt = null;

    return outcome === 'accepted';
};
