export class FetchApi {
    constructor() {
        // Constants
        this.baseUrl = 'https://jsonplaceholder.typicode.com';
    }

    async fetchData(endPoint) {
        try {
            const response = await fetch(`${this.baseUrl}/${endPoint}`);
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(`Error fetching posts: ${error.message}`);
        }
    }

    async getPosts() {
        const posts = await this.fetchData('posts');
        return posts;
    }

    async getComments(postId) {
        const post = await this.fetchData(`posts/${postId}/comments`);
        return post;
    }
}