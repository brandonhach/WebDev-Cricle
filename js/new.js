'use strict';
/**
 * Part 2
 * In new.js, when the submit button is clicked and if all fields are valid,

    prevent browser default behavior
    create a new blog with user inputs in the form, use the default.jpeg in the images folder as the profile image for the new blog, and use the current date for the date field
    send a fetch request to the JSON server to create the blog on the server
    if the request is completed successfully, redirect the browser to the landing page. 

If some of the fields is not valid, display the validation error and create no new blog.
 * 
 */
const url = 'http://localhost:3000/blogs';

document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('form');
	form.addEventListener('submit', handleFormSubmit);
});

function handleFormSubmit(e) {
	// title, author, content
	e.preventDefault();
	const title = document.querySelector('#title');
	const author = document.querySelector('#author');
	const content = document.querySelector('#content');

	const newBlog = {
		title: title.value,
		author: author.value,
		date: new Date().toISOString(),
		profile: 'images/default.jpeg',
		content: content.value,
	};

	createBlog(newBlog);
}

async function createBlog(blogData) {
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(blogData),
		});

		if (!response.ok) {
			throw Error(`Error ${response.url} ${response.statusText}`);
		}

		window.location.href = 'index.html';
	} catch (error) {
		console.error(error.message);
		toggleNotification(true, error.message);
	}
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
