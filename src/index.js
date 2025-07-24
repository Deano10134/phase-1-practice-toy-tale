let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn             = document.querySelector("#new-toy-btn");
  const toyFormContainer   = document.querySelector(".container");
  const toyForm            = document.querySelector(".add-toy-form");
  const toyCollection      = document.querySelector("#toy-collection");

  // Toggle the new-toy form
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch & render all toys
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => toys.forEach(addToyToCollection))
    .catch(err => console.error("Error fetching toys:", err));

  // Handle form submit (POST)
  toyForm.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(toyForm);
    const newToy = {
      name:  formData.get("name"),
      image: formData.get("image"),
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept":       "application/json"
      },
      body: JSON.stringify(newToy)
    })
    .then(res => res.json())
    .then(toy => {
      addToyToCollection(toy);
      toyForm.reset();
    })
    .catch(err => console.error("Error adding toy:", err));
  });
});

// Delegate like-button clicks (PATCH)
document.addEventListener("click", event => {
  if (!event.target.classList.contains("like-btn")) return;

  const btn   = event.target;
  const toyId = btn.dataset.id;
  const likeP = btn.previousElementSibling; // <p> element
  let likes   = parseInt(likeP.textContent);

  likes += 1;

  fetch(`http://localhost:3000/toys/${toyId}`, {
    method:  "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept":       "application/json"
    },
    body: JSON.stringify({ likes })
  })
  .then(res => res.json())
  .then(updatedToy => {
    likeP.textContent = `${updatedToy.likes} Likes`;
    btn.dataset.id   = updatedToy.id;              // keep ID in sync
  })
  .catch(err => console.error("Error updating likes:", err));
});

// Utility: render a single toy card
function addToyToCollection(toy) {
  const toyCard = document.createElement("div");
  toyCard.className = "card";
  toyCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
  `;
  document.querySelector("#toy-collection").appendChild(toyCard);
}
