// Import the FetchApi, Debounce, ModalApp, AlertApp classes from their respective files
import { FetchApi } from "./fetch.js";
import { ModalApp } from "./modal.js";
import { Debouncer } from "./debounce.js";
import { AlertApp } from "./alert.js";

// Define the MainApp class
class MainApp {
    constructor() {
        // DOM Elements
        this.clearButton = document.querySelector('.clear-button');
        this.searchInput = document.querySelector('.search-input');
        this.postsContainer = document.querySelector('.posts-container');
        this.numbersContainer = document.querySelector('.numbers-container');
        this.prevButton = document.querySelector('.prev-button');
        this.nextButton = document.querySelector('.next-button');
        this.noDataContainer = document.querySelector('.nodata-container');
        this.paginationContainer = document.querySelector('.pagination-container');
        this.window = window;

        // Event Listeners
        this.searchInput.addEventListener('input', () => this.debouncer.debounce(this.handleSearchInput.bind(this), 300));
        this.clearButton.addEventListener('click', this.clearInput.bind(this));
        this.prevButton.addEventListener('click', this.prevPageClick.bind(this));
        this.nextButton.addEventListener('click', this.nextPageClick.bind(this));
        this.window.addEventListener('resize', this.resizeListenEvent.bind(this));

        // Data
        this.postsData = [];
        this.filteredPosts = [];
        this.pageNum = 1;
        this.pageSize = 0;
        this.itemPerPage;

        this.debounceTimeout;

        this.resizeEventFired = false;

        // Create instances of FetchApi and ModalApp classes
        this.fetchApi = new FetchApi();
        this.modalApp = new ModalApp();
        this.debouncer = new Debouncer(300);
        this.alert = new AlertApp();
        this.getPosts();
    }

    // Method to change the visibility of the clear button based on search input
    changeClearButtonVisibility() {
        if (this.searchInput.value) {
            this.clearButton.classList.remove('d-none');
            this.clearButton.classList.add('d-block');
        } else {
            this.clearButton.classList.remove('d-block');
            this.clearButton.classList.add('d-none');
        }
    }

    // Method to clear the search input
    clearInput() {
        this.searchInput.value = '';
        this.filteredPosts = [];
        this.changeClearButtonVisibility();
        this.setHtml(this.pageSize, this.pageNum, this.postsData);
        this.setPaginator(this.postsData);
    }

    // Method to create a post card element
    createPostCard(post) {
        const postCard = document.createElement('div');
        postCard.classList.add('post-card');
        postCard.addEventListener('click', () => this.inspectPost(post.id));

        const postContent = document.createElement('div');
        postContent.classList.add('post-content');

        const postTitle = document.createElement('h2');
        postTitle.textContent = post.title;

        const postBody = document.createElement('p');
        postBody.textContent = post.body;

        const deleteButton = document.createElement('button');
        deleteButton.addEventListener('click', (event) => this.deletePost(post.id, event))
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';
        postContent.appendChild(postTitle);
        postContent.appendChild(postBody);

        postCard.appendChild(postContent);
        postCard.appendChild(deleteButton);

        return postCard;
    }

    // Method to set the HTML content based on the current page and size
    setHtml(itemPerPage, currentPage, posts) {
        const startIndex = (currentPage - 1) * itemPerPage;
        const endIndex = startIndex + itemPerPage;

        this.postsContainer.innerHTML = ''; // Clear the content

        posts.slice(startIndex, endIndex).forEach((post) => {
            const postCard = this.createPostCard(post);
            this.postsContainer.appendChild(postCard);
        });

        // Check the length of filtered posts and update visibility of "No Data" container
        this.checkLengthFilteredPosts(posts);
    }

    // Method to set the paginator based on the window width
    setPaginator(posts) {
        const innerWidth = window.innerWidth;
        const totalItems = posts.length;

        switch (true) {
            case innerWidth < 768:
                this.pageSize = 8;
                break;
            case innerWidth >= 768 && innerWidth < 992:
                this.pageSize = 12;
                break;
            case innerWidth >= 992:
                this.pageSize = 16;
                break;
        }

        this.itemPerPage = Math.ceil(totalItems / this.pageSize);
        this.numbersContainer.innerHTML = '';

        for (let i = 1; i <= this.itemPerPage; i++) {
            const paginationButton = this.createPaginationButton(i);
            paginationButton.addEventListener('click', () => this.handlePageClick(i));
            this.numbersContainer.appendChild(paginationButton);
            if (i === this.pageNum) {
                paginationButton.classList.add('active-page');
            }
        }

        // Display the first page by default
        this.setHtml(this.pageSize, this.pageNum, posts);
    }

    // Method to handle resize events and update the paginator
    resizeListenEvent() {
        const innerWidth = window.innerWidth;

        if (innerWidth < 768 && this.pageSize !== 8) {
            this.setPaginator(this.postsData);
            this.resizeEventFired = true;
        } else if (innerWidth >= 768 && innerWidth < 992 && this.pageSize !== 12) {
            this.setPaginator(this.postsData);
            this.resizeEventFired = true;
        } else if (innerWidth >= 992 && this.pageSize !== 16) {
            this.setPaginator(this.postsData);
            this.resizeEventFired = true;
        }
    }

    // Method to create a pagination button
    createPaginationButton(number) {
        const button = document.createElement('button');
        button.classList.add('pagination-button');
        button.innerText = number;
        return button;
    }

    // Method to handle page click events
    handlePageClick(pageNumber) {
        this.pageNum = pageNumber;
        const posts = this.filteredPosts.length > 0 ? this.filteredPosts : this.postsData;
        this.setHtml(this.pageSize, this.pageNum, posts);
        this.setPaginator(posts);
    }

    prevPageClick() {
        this.pageNum = 1;
        const posts = this.filteredPosts?.length > 0 ? this.filteredPosts : this.postsData;
        this.setHtml(this.pageSize, this.pageNum, posts);
        this.setPaginator(posts)
    }

    nextPageClick() {
        this.pageNum = this.itemPerPage;
        const posts = this.filteredPosts?.length > 0 ? this.filteredPosts : this.postsData;
        this.setHtml(this.pageSize, this.pageNum, posts);
        this.setPaginator(posts)
    }

    // Method to handle search input
    handleSearchInput() {
        this.pageNum = 1;
        this.changeClearButtonVisibility();
        const searchTerm = this.searchInput.value.toLowerCase();
        this.filteredPosts = this.postsData.filter(post => {
            const title = post.title.toLowerCase();
            const body = post.body.toLowerCase();
            return title.includes(searchTerm) || body.includes(searchTerm);
        });

        this.setPaginator(this.filteredPosts);
        this.setHtml(this.pageSize, this.pageNum, this.filteredPosts);
    }

    // Method to check the length of filtered posts and update visibility of "No Data" container
    checkLengthFilteredPosts(filteredPosts) {
        if (!filteredPosts.length) {
            this.noDataContainer.classList.remove('d-none');
            this.noDataContainer.classList.add('d-block');
        } else {
            this.noDataContainer.classList.add('d-none');
            this.noDataContainer.classList.remove('d-block');
        }
    }

    // Method to delete a post
    deletePost(postId, event) {
        event.stopPropagation();

        this.alert.showAlert().then((result) => {

            if (result === 'Alert confirmed') {
                this.postsData = this.postsData.filter(post => post.id !== postId);
                this.setPaginator(this.postsData);
                this.setHtml(this.pageSize, this.pageNum, this.postsData);
            } else {
                // 
            }
        });
    }

    // Method to inspect a post and open the modal
    inspectPost(postId) {
        this.modalApp.openModal(postId);
    }

    // Method to fetch posts from the API
    getPosts() {
        this.fetchApi.getPosts()
            .then((posts) => {
                this.postsData = posts;
                this.setPaginator(posts);
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

// Create an instance of the MainApp class
const mainApp = new MainApp();
