export class AlertApp {
    constructor() {
        // Get references to the DOM elements
        this.alertContainer = document.querySelector('.alert-container');
        this.overlay = document.createElement('div');
        this.overlay.classList.add("overlay");
        document.body.appendChild(this.overlay);
    }

    showAlert() {
        // Create a new promise for each showAlert call
        this.alertPromise = new Promise((resolve, reject) => {
            this.resolvePromise = resolve;
            this.rejectPromise = reject;
        });

        // Create the alert popup
        const alertPopup = document.createElement('div');
        alertPopup.classList.add('alert-popup');
        alertPopup.innerHTML = `
            <p>Are you sure you want to delete?</p>
            <div class="alert-buttons">
            <button class="confirm-btn">Delete</button>
            <button class="cancel-btn">Close</button>
            </div>
        `;

        // Attach event listeners
        alertPopup.querySelector('.confirm-btn').addEventListener('click', () => this.confirmAlert());
        alertPopup.querySelector('.cancel-btn').addEventListener('click', () => this.ignoreAlert());

        // Append the alert popup to the container
        this.alertContainer.appendChild(alertPopup);

        // Show the overlay
        this.overlay.style.display = 'block';

        // Returning the promise to allow chaining
        return this.alertPromise;
    }

    closeAlert() {
        // Remove the alert popup
        this.alertContainer.innerHTML = '';

        // Hide the overlay
        this.overlay.style.display = 'none';

        // Reject the promise if needed
        if (this.resolvePromise) {
            this.resolvePromise('Alert closed');
            this.resolvePromise = null; // Nullify resolvePromise to prevent multiple resolutions
            this.rejectPromise = null; // Also nullify rejectPromise
        }
    }

    confirmAlert() {
        // Implement confirm logic if needed
        // After confirming, resolve the promise
        this.resolvePromise('Alert confirmed');
        
        // Close the alert after confirming
        this.closeAlert();
    }

    ignoreAlert() {
        if (this.resolvePromise) {
            this.resolvePromise('Alert ignored');
            this.resolvePromise = null; // Nullify resolvePromise to prevent multiple resolutions
            this.rejectPromise = null; // Nullify rejectPromise
        }
        this.closeAlert();
    }
}
