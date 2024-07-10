// const base_url = "https://codoacodo-g21-be.onrender.com";
const base_url = "http://127.0.0.1:5000/";
const github_url = "https://raw.githubusercontent.com/AgustinPaparo/CodoACodo-g21-BE/main/static/photos/"

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#propertyTable tbody");

  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  fetch(`${base_url}/api/properties`)
    .then((response) => response.json())
    .then((properties) => {
      console.log(properties);
      if (properties.length > 0) {
        properties.forEach((property) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${property.id}</td>
            <td>${property.propietario_id}</td>
            <td>${property.direccion}</td>
            <td>${property.tipo}</td>
            <td>${property.habitaciones}</td>
            <td>${property.baños}</td>
            <td>${property.tamaño}</td>
            <td>${property.cochera ? "Sí" : "No"}</td>
            <td>$${property.precio}</td>
            <td>${property.estado}</td>
            <td>${property.tipo_contrato}</td>
            <td>
              <button class="btn btn-info btn-sm" data-id="${
                property.id
              }"><i class="bi bi-images"></i></button>
              <button class="btn btn-success btn-sm" data-id="${
                property.id
              }"><i class="bi bi-pencil-square"></i></button>
              <button class="btn btn-danger btn-sm" data-id="${
                property.id
              }"><i class="bi bi-trash3"></i></button>
            </td>
          `;

          tableBody.appendChild(row);

          const imagesButton = row.querySelector(".btn-info");
          imagesButton.addEventListener("click", () => {
            openPhotos(property.id);
          });

          const editButton = row.querySelector(".btn-success");
          editButton.addEventListener("click", () => {
            edit_prop(property.id);
          });

          const deleteButton = row.querySelector(".btn-danger");
          deleteButton.addEventListener("click", () => {
            delete_prop(property.id);
          });
        });
      } else {
        const row = document.createElement("div");
        row.innerHTML = `
          <bold class="text-center w-100
          ">NO HAY PROPIEDADES CARGADAS</bold>
        `;

        tableBody.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error fetching properties:", error);
    });
});

function edit_prop(prop_id) {
  property = fetch(`${base_url}/api/get_property/${prop_id}`);

  // abrir el modal con todos los datos de la propiedad cargados
}

async function new_prop() {
  const form = document.getElementById("newPropForm");
  const formData = new FormData();

  formData.append("propietario_id", form.propietario_id.value);
  formData.append("direccion", form.direccion.value);
  formData.append("tipo", form.tipo.value);
  formData.append("habitaciones", form.habitaciones.value);
  formData.append("banos", form.banos.value);
  formData.append("tamano", form.tamano.value);
  formData.append("cochera", form.cochera.checked);
  formData.append("precio", form.precio.value);
  formData.append("estado", form.estado.value);
  formData.append("tipo_contrato", form.tipo_contrato.value);

  const photos = document.getElementById("photo").files;
  if (photos.length > 0) {
    for (let i = 0; i < photos.length; i++) {
      formData.append("photos", photos[i]);
    }
  }

  for (let pair of formData.entries()) {
    if (pair[0] === "photos") {
      console.log(
        `${pair[0]}: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}`
      );
    } else {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  }

  try {
    const res = await fetch(`${base_url}/api/new_property`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data);
    if (res.ok) {
      alert("Propiedad agregada exitosamente");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      alert("Error al agregar la propiedad");
    }
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    alert("Error al enviar la solicitud");
  }
}

async function delete_prop(id) {
  if (id) {
    const res = await fetch(`${base_url}/api/delete_property/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Error al eliminar");
    }

    alert("Propiedad eliminada correctamente");

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

function openPhotos(id) {
  localStorage.setItem("propertyId", id);
  window.open("photos.html", "_blank");
}

function directory_name(propietario_id, direccion) {
  let formatted_direccion = direccion.replace(/ /g, "_");
  let directory_name = `${propietario_id}-${formatted_direccion}`;

  return directory_name;
}

async function show_images(id) {
  const title = document.getElementById("title-property");
  const list = document.getElementById("list-group");

  if (id) {
    try {
      const res = await fetch(`${base_url}/api/get_property/${id}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Network response was not ok " + res.statusText);
      }

      const data = await res.json();

      title.textContent = `${data.tipo} ${data.id} en ${data.tipo_contrato}`;

      const directory = directory_name(data.propietario_id, data.direccion);

      // Limpiar la lista antes de agregar nuevas imágenes
      list.innerHTML = "";

      // Crear elementos <img> y agregarlos a la lista
      data.imagenes.forEach(img => {
        const imgElement = document.createElement('img');
        imgElement.src = `${github_url}/${directory}/${img}`;
        imgElement.alt = img; 
        
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.appendChild(imgElement);
        
        list.appendChild(listItem);
      });

    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }
}