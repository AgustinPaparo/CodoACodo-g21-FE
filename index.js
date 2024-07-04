const base_url = "https://codoacodo-g21-be.onrender.com/"

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#propertyTable tbody");

  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  fetch(`${base_url}/api/properties`)
    .then((response) => response.json())
    .then((properties) => {
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
            <td>${property.precio}</td>
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

        const deleteButton = row.querySelector('.btn-danger');
        deleteButton.addEventListener('click', () => {
          delete_prop(property.id);
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching properties:", error);
    });
});

function edit_property(prop_id) {
  property = fetch(`${base_url}/api/get_property/${prop_id}`);

  // abrir el modal con todos los datos de la propiedad cargados
}

async function new_prop() {
  const form = document.getElementById("newPropForm");

  send = {
    propietario_id: form.propietario_id.value,
    direccion: form.direccion.value,
    tipo: form.tipo.value,
    habitaciones: form.habitaciones.value,
    banos: form.banos.value,
    tamano: form.tamano.value,
    cochera: form.cochera.checked,
    precio: form.precio.value,
    estado: form.estado.value,
    tipo_contrato: form.tipo_contrato.value
  };

  try {
    const res = await fetch(`${base_url}/api/new_property`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(send), // Convertir el objeto a JSON
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

async function delete_prop(id){
  if (id) {
    const res = await fetch(`${base_url}/api/delete_property/${id}`,
      {method : "DELETE"}
    )

    if(!res.ok){
      throw new Error("Error al eliminar")
    }

    alert("Propiedad eliminada correctamente")

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}