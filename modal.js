// Import the FetchApi class from the fetch.js file
import { FetchApi } from "./fetch.js";

// Define the ModalApp class
export class ModalApp {
    constructor() {
        // Initialize the properties
        this.postId;

        // Get references to the DOM elements
        this.postContainer = document.querySelector('.post-container');
        this.overlay = document.createElement('div');
        this.overlay.classList.add("overlay");
        document.body.appendChild(this.overlay);

        // Create an instance of the FetchApi class
        this.fetchApi = new FetchApi();
    }

    // Method to open the modal with comments for a given post ID
    openModal(postId) {
        this.postId = postId;
        this.getComments();
    }

    // Method to fetch comments for the specified post ID
    getComments() {
        this.fetchApi.getComments(this.postId)
            .then((postComments) => {
                this.setHtml(postComments);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // Method to set the HTML content of the modal with comments
    setHtml(postComments) {
        // Create a close button for the modal
        const closeButton = this.createCloseButton();

        // Display the overlay and post container
        this.overlay.style.display = "block";
        this.postContainer.style.display = "flex";

        // Clear the existing content and add the close button
        this.postContainer.innerHTML = '';
        this.postContainer.appendChild(closeButton);

        // Add comment blocks for each comment in the array
        postComments.forEach(comment => {
            const commentCard = this.createCommentBlock(comment);
            this.postContainer.appendChild(commentCard);
        });
    }

    // Method to create a close button with an event listener
    createCloseButton() {
        const closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        closeButton.addEventListener('click', () => this.closeModal());

        // Create an icon for the close button
        const closeIcon = document.createElement('img');
        closeIcon.setAttribute('src', './assets/clear-red.svg');
        closeIcon.setAttribute('width', '32px');
        closeButton.appendChild(closeIcon);

        return closeButton;
    }

    // Method to create a comment block for a given comment
    createCommentBlock(comment) {
        const commentCard = document.createElement('div');
        commentCard.classList.add('comment-card');

        const commentContent = document.createElement('div');
        commentContent.classList.add('comment-content');

        const commentName = document.createElement('h3');
        commentName.textContent = comment.name;

        const author = document.createElement('p');
        author.textContent = 'Author: ';

        const authorEmail = document.createElement('a');
        authorEmail.textContent = comment.email;
        authorEmail.setAttribute('href', `mailto:${comment.email}`);
        author.appendChild(authorEmail);

        const commentBody = document.createElement('p');
        commentBody.textContent = comment.body;

        commentContent.appendChild(commentName);
        commentContent.appendChild(commentBody);
        commentContent.appendChild(author);

        commentCard.appendChild(commentContent);

        return commentCard;
    }

    // Method to close the modal
    closeModal() {
        this.postContainer.style.display = "none";
        this.overlay.style.display = "none";
        document.body.style.overflow = ""; // Reset the body overflow
    }
}
