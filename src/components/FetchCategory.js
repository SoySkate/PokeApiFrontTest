import { useState, useEffect } from "react";
import React from "react";

const FetchCategory = () => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [categoryNameUpdate, setCategoryNameUpdate] = useState("");
    const [categoryId, setCategoryId] = useState("");
  
    useEffect(() => {
      fetch("https://localhost:7156/api/Category", {
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setCategories(data);
        })
        .catch((error) => console.error("Error fetching categories:", error));
    }, []);
  
    //evento form si cambia el input
    const handleChangeCat = (event) => {
      setCategoryName(event.target.value);
    };
    //evento form si se envia el contenido del form
    const handleSubmit = (event) => {
      event.preventDefault();
  
      // Crear el objeto CategoryDto
      const categoryDto = {
        name: categoryName,
      };
  
      // Hacer la llamada POST al backend CREATE
      fetch("https://localhost:7156/api/Category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryDto),
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else if (response.status === 400 || response.status === 422) {
            return response.json().then((data) => {
              throw new Error(JSON.stringify(data));
            });
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .then((data) => {
          console.log("Success:", data);
          setCategoryName("");
          // Actualizar la lista de categorías
          fetch("https://localhost:7156/api/Category", {
            credentials: "include",
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              console.log(data);
              setCategories(data);
            })
            .catch((error) => console.error("Error fetching categories:", error));
        })
        .catch((error) => {
          console.error("Error:", error.message);
          // Aquí puedes manejar los errores, por ejemplo, mostrando un mensaje al usuario
        });
    };
  
    const handleDelete = (id) => {
      fetch(`https://localhost:7156/api/Category/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            console.log("Categoría eliminada: " + response.status);
            // Update the categories list by filtering out the deleted category
            setCategories((prevCategories) =>
              prevCategories.filter((category) => category.id !== id)
            );
          } else {
            console.log("Error al eliminar la categoría: " + response.status);
            throw new Error("Failed to delete category");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar la categoría:", error);
          // Optionally, you can add user feedback here, e.g., show an error message
        });
    };
  
    //evento form si se envia el contenido del form UPDATE
    const handleUpdate = (event) => {
      event.preventDefault();
      const updateDto = {
        id: categoryId,
        name: categoryNameUpdate,
      };
      fetch(`https://localhost:7156/api/Category/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateDto),
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
          }
          const  contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json"))
            return response.json();
          else
            return response.text().then((text) =>
              text ? JSON.parse(text) : {}
            );
        })
        .then((updatedCategory) => {
          console.log("Category uppdated successfully:", updatedCategory);
          //updated list of categoriesUI
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.id === updatedCategory.id ? updatedCategory : category
            )
          );
  
          // Limpiar los campos del formulario
          setCategoryId("");
          setCategoryNameUpdate("");
        });
    };
    const handleChangeCatId = (event) => {
      setCategoryId(event.target.value);
    };
    const handleChangeCatName = (event) => {
      setCategoryNameUpdate(event.target.value);
    };

    return(
        <div className="CategoryComponent">
      <h1>Get Categories</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {category.id} -{category.name}{" "}
            <button onClick={() => handleDelete(category.id)}>Delete Category</button>
          </li>
        ))}
      </ul>
      <h1>Create Category</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={categoryName}
          onChange={handleChangeCat}
          placeholder="Enter category name"
        />
        <button type="submit">Create Category</button>
      </form>
      <h1>Update Category</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={categoryId}
          onChange={handleChangeCatId}
          placeholder="Enter category id"
        />
        <input
          type="text"
          value={categoryNameUpdate}
          onChange={handleChangeCatName}
          placeholder="Enter category name"
        />
        <button type="submit">Update Category</button>
      </form>
    </div>
    );
}

export default FetchCategory;
