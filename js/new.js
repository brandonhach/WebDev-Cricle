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

		window.location.href = 'details.html';
	} catch (error) {
		console.error(error.message);
	}
}
