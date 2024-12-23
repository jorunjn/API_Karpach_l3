const userList = document.getElementById('userList');
const commentsSection = document.getElementById('commentsSection');

async function fetchUsers() {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    renderUserList(response.data);
  } catch (error) {
    userList.innerHTML = '<li>Не удалось загрузить пользователей.</li>';
  }
}

function renderUserList(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = user.name;
    link.href = `#user-${user.id}`;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = `user-${user.id}`;
    });
    li.appendChild(link);
    userList.appendChild(li);
  });
}

async function showUserComments(userId) {
  try {
    const postsResponse = await axios.get('https://jsonplaceholder.typicode.com/posts', {
      params: { userId }
    });
    const posts = postsResponse.data;
    const commentsPromises = posts.map((post) =>
      axios.get('https://jsonplaceholder.typicode.com/comments', { params: { postId: post.id } })
    );
    const commentsResponses = await Promise.all(commentsPromises);
    let comments = [];
    commentsResponses.forEach((res) => {
      comments = comments.concat(res.data);
    });
    comments = comments.slice(0, 15);
    renderComments(comments, userId);
  } catch (error) {
    commentsSection.innerHTML = '<p>Не удалось загрузить комментарии.</p>';
  }
}

function renderComments(comments, userId) {
  commentsSection.innerHTML = `<h2>Комментарии пользователя ${userId}</h2>`;
  if (comments.length === 0) {
    commentsSection.innerHTML += '<p>Нет комментариев.</p>';
    return;
  }
  const ul = document.createElement('ul');
  ul.classList.add('comments-list');
  comments.forEach((comment) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${comment.name}</strong>: ${comment.body}`;
    ul.appendChild(li);
  });
  commentsSection.appendChild(ul);
}

function handleHashChange() {
  const hash = window.location.hash;
  if (hash.startsWith('#user-')) {
    const userId = parseInt(hash.replace('#user-', ''), 10);
    showUserComments(userId);
  } else {
    commentsSection.innerHTML = '';
  }
}

window.onhashchange = handleHashChange;

fetchUsers();
handleHashChange();
