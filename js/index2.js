'use strict';
const MAX_LENGTH = 50; // Maximum length of the blog content shown on the page, i.e., if the blog content is longer, truncate it.
const PAGE_LIMIT = 12; // Number of blogs per page

document.addEventListener('DOMContentLoaded', () => {
	fetchBlogs(1);
});

async function fetchBlogs(page) {
	try {
		const response = await fetch(
			`http://localhost:3000/blogs?_page=${page}&_limit=${PAGE_LIMIT}&_sort=date&_order=desc`
		);

		if (!response.ok) {
			throw Error(`Error ${response.url} ${response.statusText}`);
		}

		const totalCount = response.headers.get('x-total-count');
		const blogs = await response.json();

		displayBlogs(blogs, MAX_LENGTH);
		createPaginationButtons(totalCount, page);
	} catch (error) {
		console.log(error.message);
	}
}

function displayBlogs(blogs, maxLength) {
	const articlesWrapper = document.querySelector('.articles-wrapper');

	articlesWrapper.innerHTML = '';

	blogs.forEach((blog) => {
		const article = document.createElement('article');
		article.classList.add('card');

		// Header
		const header = document.createElement('div');
		header.classList.add('card-header');

		// Profile image
		const profileImage = document.createElement('img');
		profileImage.src = blog.profile;
		profileImage.width = 60;
		profileImage.height = 60;
		profileImage.alt = 'profile picture';
		profileImage.classList.add('avatar');

		header.appendChild(profileImage);

		// Author and date
		const data = document.createElement('div');
		data.textContent = `${blog.author} · ${new Date(blog.date).toDateString()}`;

		header.appendChild(data);

		// Title and content
		const body = document.createElement('div');
		body.classList.add('card-body');

		const title = document.createElement('h3');
		title.textContent = blog.title;

		const content = document.createElement('p');

		body.appendChild(title);
		body.appendChild(content);

		// Truncate
		const truncatedContent =
			blog.content.length > maxLength ? blog.content.substring(0, maxLength) + '...' : blog.content;
		content.textContent = truncatedContent;

		article.appendChild(header);
		article.appendChild(body);

		article.addEventListener('click', () => {
			window.location.href = `details.html?id=${blog.id}`;
		});

		articlesWrapper.appendChild(article);
	});
}

function createPaginationButtons(totalCount, currentPage) {
	const paginationContainer = document.querySelector('.pagination-container');
	paginationContainer.innerHTML = '';

	const totalPages = Math.ceil(totalCount / PAGE_LIMIT);

	for (let i = 1; i <= totalPages; i++) {
		const pageButton = document.createElement('button');
		pageButton.classList.add('page-btn');
		pageButton.textContent = i;

		if (i === currentPage) {
			pageButton.classList.add('active');
		}

		pageButton.addEventListener('click', () => {
			fetchBlogs(i);
		});

		paginationContainer.appendChild(pageButton);
		console.log(totalCount);
	}
}

const search = document.querySelector('.search-bar input');
search.addEventListener('input', (e) => {
	const key = e.target.value;
	if (key) {
		fetchKeyBlogs(key);
	}
});

// const searchBar = document.querySelector('.search-bar');
// searchBar.addEventListener('input', () => {
// 	const searchInput = document.querySelector('input').value;
// 	//console.log(searchInput);
// 	if (searchInput) {
// 		fetchFiliteredBlogs(searchInput);
// 	}
// });

async function fetchKeyBlogs(key, page = 1) {
	try {
		const response = await fetch(
			`http://localhost:3000/blogs?_q=${encodeURIComponent(
				key
			)}&_page=${page}&_limit=${PAGE_LIMIT}&_sort=date&_order=desc`
		);

		if (!response.ok) {
			throw Error(`Error ${response.url} ${response.statusText}`);
		}

		const totalCount = response.headers.get('x-total-count');
		const blogs = await response.json();

		displayBlogs(blogs, MAX_LENGTH);
		createPaginationButtons(totalCount, page);
		console.log(blogs);
	} catch (error) {
		console.log(error.message);
	}
}
