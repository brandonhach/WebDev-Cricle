'use strict';
const url = 'http://localhost:3000/blogs';

/**
 * Part 3
 * Display the blog

    when the page loads, send a fetch request to JSON server to get the blog
    if the request is completed successfully, display the blog. 
    make sure you use the proper tags and classes so that the blog in the html document has the following structure. Note that the edit button is actually an anchor element, and it links to the edit.html page but with a query parameter.
 * 
 */

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
		displayBlogPost(blog);
	} catch (error) {
		console.log(error.message);
		toggleNotification(true, error.message);
	}
}

async function deleteBlog() {
	try {
		const currentURL = new URL(window.location.href);
		const blogId = currentURL.searchParams.get('id');
		const response = await fetch(`${url}/${blogId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw Error(`Error ${response.url} ${response.statusText}`);
		}
		window.location.href = 'index.html';
	} catch (error) {
		console.log(error.message);
		toggleNotification(true, error.message);
	}
}

function displayBlogPost(blog) {
	// wrapper container
	const wrapper = document.querySelector('.wrapper');

	//heading2
	const heading2 = document.createElement('h2');
	heading2.textContent = blog.title;
	wrapper.append(heading2);

	//article-header container
	const articleHeader = document.createElement('div');
	articleHeader.className = 'article-header';

	//img
	const avatar = document.createElement('img');
	avatar.className = 'avatar';
	avatar.alt = 'profile picture';
	avatar.width = '60';
	avatar.height = '60';
	avatar.src = blog.profile;

	//div header (name & date)
	const formattedDate = formatDate(blog.date);
	const header = document.createElement('div');
	header.textContent = `${blog.author} • ${formattedDate}`;

	//append
	articleHeader.append(avatar, header);
	wrapper.append(articleHeader);

	//btn-container
	const btnContainer = document.createElement('div');
	btnContainer.className = 'btn-container';

	//a tag
	const aBtn = document.createElement('a');
	aBtn.className = 'btn';
	aBtn.href = `/edit.html?id=${blog.id}`; // FETCH
	const iTagPen = document.createElement('i');
	iTagPen.className = 'fa-solid fa-pen';
	aBtn.append(iTagPen);
	btnContainer.append(aBtn);

	//button
	const btn = document.createElement('btn');
	btn.className = 'btn';
	const iTagTrashCan = document.createElement('i');
	iTagTrashCan.className = 'fa-solid fa-trash-can';
	btn.append(iTagTrashCan);
	btnContainer.append(btn);

	//append btn-container to wrapper
	wrapper.append(btnContainer);

	// paragraph
	const p = document.createElement('p');
	p.className = 'article-body';
	p.textContent = blog.content;
	wrapper.append(p);

	/**
     * 2.) Delete the blog

    when the delete button is clicked, send a fetch request to JSON server to delete the blog
    if the request is completed successfully, redirect the browser to the landing page. 

     * 
     */
	btn.addEventListener('click', deleteBlog);
}

function formatDate(dateString) {
	const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', options);
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
