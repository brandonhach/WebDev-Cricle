'use strict';
const url = 'http://localhost:3000/blogs';

document.addEventListener('DOMContentLoaded', () => {
	fetchBlogPost();
});

async function fetchBlogPost() {
	try {
		const currentURL = new URL(window.location.href);
		const blogId = currentURL.searchParams.get('id');
		const response = await fetch(`${url}/${blogId}`);
		if (!response.ok) {
			throw Error(`Error ${response.url} ${response.statusText}`);
		}
		const blog = await response.json();
		populateBlogPost(blog);
	} catch (error) {
		console.log(error.message);
		toggleNotification(true, error.message);
	}
}

/**
 * 2.) Update the blog

    When the submit button is clicked and all fields are valid,
        prevent browser default behavior
        send a fetch request to the JSON server to update the blog
        if the request is completed successfully, redirect the browser to the details page. 
    If some field is not valid, display the input validation error.

 * 
 */

async function handleEditFormSubmit(e, blog) {
	e.preventDefault();
	try {
		const title = document.querySelector('#title').value;
		const content = document.querySelector('#content').value;

		const updatedBlog = {
			title: title,
			author: blog.author,
			date: blog.date,
			profile: blog.profile,
			content: content,
		};

		const response = await fetch(`${url}/${blog.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedBlog),
		});

		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}

		window.location.href = `details.html?id=${blog.id}`;
	} catch (error) {
		console.error(error.message);
		toggleNotification(true, error.message);
	}
}

/** 
 * Part 4 Populate the edit form

    1.) When the page loads, send a fetch request to JSON server to get the blog
    if the request is completed successfully, populate the form.

 * 
 */
function populateBlogPost(blog) {
	const title = document.querySelector('#title');
	title.value = blog.title;

	const content = document.querySelector('#content');
	content.value = blog.content;

	const form = document.querySelector('form');
	form.addEventListener('submit', (e) => handleEditFormSubmit(e, blog));
}

/**
 * Part 5
 * API calls may cause errors. To let the user know what is going on, the app should display proper error message on the page. In all of the html files, there is a div with class 'notification'. Whenever there is an API error, place the error message as text content of 'notification' and make the 'notification-container' element appear on the page. Further, when users click the 'close' button, remove the 'notification-container' element from the page.
 *
 */

function toggleNotification(show, message = '') {
	const notificationContainer = document.querySelector('.notification-container');

	if (show) {
		notificationMessage.textContent = message;
		notificationContainer.classList.remove('hidden');
	} else {
		notificationContainer.classList.add('hidden');
	}
}
