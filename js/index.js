'use strict';
const MAX_LENGTH = 50; //maximum length of the blog content shown on the page, i.e., if the blog content is longer, truncate it.
const PAGE_LIMIT = 12; //number of blogs per page

const url = 'http://localhost:3000/blogs';

/**
 * 1.) Fetch and paginate blogs:
 * add an event listener to the window object to listen to the 'DOMContentLoaded' event,
 * so that when the page loads, a fetch request is sent to the JSON server to get the first page of blogs.
 */

document.addEventListener('DOMContentLoaded', () => {
	fetchPaginateBlogs();
	const searchInput = document.querySelector('input');
	searchInput.value = ''; // clear existing input on refresh
});

async function fetchPaginateBlogs(pageNumber) {
	const paginatedUrl = `${url}?_page=${pageNumber}&_limit=${PAGE_LIMIT}&_sort=date&_order=desc`;
	try {
		const response = await fetch(paginatedUrl);
		if (!response.ok) {
			throw Error(`Error ${response.url} ${response.statusText}`);
		}
		const blogs = await response.json();
		const articleWrapper = document.querySelector('.articles-wrapper');
		articleWrapper.innerHTML = ''; // clear existing article
		displayBlogs(blogs);
		createPaginationButton(response.headers.get('x-total-count'), pageNumber);
	} catch (error) {
		console.log(error.message);
	}
}

async function fetchFiliteredBlogs(searchInput, pageNumber) {
	const paginatedUrl = `${url}?q=${encodeURIComponent(
		searchInput
	)}&_page=${pageNumber}&_limit=${PAGE_LIMIT}&_sort=date&_order=desc`;
	try {
		const response = await fetch(paginatedUrl);
		if (!response.ok) {
			throw Error(`Error ${response.url} ${response.statusText}`);
		}
		const blogs = await response.json();
		const articleWrapper = document.querySelector('.articles-wrapper');
		articleWrapper.innerHTML = ''; // clear existing article
		displayBlogs(blogs);
		createPaginationButton(response.headers.get('x-total-count'), pageNumber);
	} catch (error) {
		console.log(error.message);
	}
}

/**
 * 2.) Display fetched blogs on the page: each blog is appended as a child of the element with class 'articles-wrapper'.
 * Make sure you use the proper tags and classes so that each blog has the following html structure  Further,
 * if the length of the blog content is longer than MAX_LENGTH,  truncate it to MAX_LENGTH and append '... ' to the truncated content,
 * @param {*} blogs
 */
function displayBlogs(blogs) {
	const articleWrapper = document.querySelector('.articles-wrapper');

	blogs.forEach((blog) => {
		const card = document.createElement('article');
		card.className = 'card';

		//card-header
		const cardHeader = document.createElement('div');
		cardHeader.className = 'card-header';

		const img = document.createElement('img');
		img.className = 'avatar';
		img.width = '60';
		img.height = '60';
		img.alt = 'profile picture';
		img.src = blog.profile;

		// format date
		const formattedDate = formatDate(blog.date);

		const heading = document.createElement('div');
		heading.textContent = `${blog.author} • ${formattedDate}`;

		cardHeader.append(img, heading);

		//card-body
		const cardBody = document.createElement('div');
		cardBody.className = 'card-body';

		const header3 = document.createElement('h3');
		header3.textContent = blog.title;
		const paragraph = document.createElement('p');

		// truncation of blog.content
		const content = blog.content;
		paragraph.textContent = content.length > MAX_LENGTH ? `${content.substring(0, MAX_LENGTH)} ... ` : content;

		cardBody.append(header3, paragraph);

		// Append both div container as child for card
		card.append(cardHeader, cardBody);
		articleWrapper.append(card);

		/**
		 * 3.) Add event listener to the blogs: when any blog on the page is clicked, the browser is redirected to the details.html page.
		 * To support this, add an event listener to each article element after you create the element.
		 * The event handler simply changes the window.location.href to details.html with a query parameter id, whose value is the id of the blog.
		 * For example, if the blog with id 5 is clicked, the url should be details.html?id=5.
		 *
		 */

		card.addEventListener('click', (e) => {
			window.location.href = `details.html?id=${blog.id}`;
		});
	});
}

function formatDate(dateString) {
	const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', options);
}

/**
 * 4.) Create pagination buttons and append them to the element with class 'pagination-container'.
 * Each page button is a button element with a class 'page-btn'.
 * Each button's text content is the page number it refers to, i.e., the first button has a text content of '1'.
 * Implement event handling so that when a pagination button is clicked,
    the current active button becomes inactive
    the button being clicked becomes active
    send a fetch request to the server to get the blogs on that page. Again, this can be easily done by including query parameter on the url. 
    update the content of the 'articles-wrapper' element to display blogs returned from the server 

 * @param {*} blogs
 */
function createPaginationButton(totalBlogs, pageNumber) {
	const paginationContainer = document.querySelector('.pagination-container');
	paginationContainer.innerHTML = ''; // clear existing buttons
	const totalPages = Math.ceil(totalBlogs / PAGE_LIMIT);

	for (let i = 1; i <= totalPages; i++) {
		const button = document.createElement('button');
		button.className = 'page-btn';
		button.textContent = i;

		if (i === pageNumber) {
			button.classList.add('active');
		}

		button.addEventListener('click', (e) => {
			document.querySelector('.page-btn.active').classList.remove('active');
			e.target.classList.add('active');
			fetchPaginateBlogs(i); // page number sent
		});

		paginationContainer.append(button);
	}

	// sets first button as active on inital load
	if (!document.querySelector('.page-btn.active')) {
		paginationContainer.children[0].classList.add('active');
	}
}

/**
 * 5.) Filter blogs: add an event listener to the 'search' input in the header to handle a change event. 
 * When this event happens, fetch the blogs that contain the string users entered in the search bar.  
 * Since JSON server supports full text search, this can be easily implemented by including an additional query parameter. 
 * Here are some hints on how to do this:
    when the value of the search bar is changed, get the value of the search bar,
        if the value is not empty, send a fetch request to the server to get the first page of the filtered blogs. If the operation is completed successfully,  display the blogs on the page, and create pagination buttons accordingly. 
        if the value is empty, send a fetch request to the server to get the first page of the blogs
 * 
 */
const searchBar = document.querySelector('.search-bar');
searchBar.addEventListener('input', () => {
	const searchInput = document.querySelector('input').value;
	//console.log(searchInput);
	if (searchInput) {
		fetchFiliteredBlogs(searchInput);
	}
});
