let todasLasTareas = [];
let todosLosLogros = [];
//cargarTareasLista//

function toggleMenu() {
  document.getElementById("sidebar").classList.toggle("active");
}

function openAvatar() {
  document.getElementById("avatarModal").classList.add("active");
  document.getElementById("avatarOverlay").classList.add("active");
}

function closeAvatar() {
  document.getElementById("avatarModal").classList.remove("active");
  document.getElementById("avatarOverlay").classList.remove("active");
}

//////////////////////////////////////////

const API = "http://3.134.77.54:5000/api";

// ===============================
// CREAR USUARIO (LOGIN)
// ===============================
function crearUsuario(e) {
  e.preventDefault();

  const name  = document.getElementById("input-name").value.trim();
  const email = document.getElementById("input-email").value.trim();
  const password = document.getElementById("input-password").value;

  // Verificar nombre único primero
  fetch(`${API}/users/?email=${email}`)
    .then(res => res.json())
    .then(data => {
      // Verificar si el nombre ya existe
      return fetch(`${API}/users/`)
        .then(res => res.json())
        .then(allUsers => {
          const nameExists = allUsers.some(u => u.name.toLowerCase() === name.toLowerCase());
          if (nameExists) {
            alert("Ese nombre de usuario ya está en uso. Elige otro.");
            throw new Error("nombre duplicado");
          }
        });
    })
    .then(() => {
      return fetch(`${API}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, level: "1", xp: 0 })
      });
    })
    .then(res => {
      if (!res.ok) throw new Error("Error al crear usuario");
      return res.json();
    })
    .then(data => {
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "seccion.html";
    })
    .catch(err => {
      if (err.message !== "nombre duplicado") {
        alert("Error: " + err.message);
      }
    });
}

// ===============================
// CARGAR HOME
// ===============================
function cargarHome() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const xpTotal = user.xp || 0;
  const level   = Math.floor(xpTotal / 100) + 1;
  const xpEnNivel = xpTotal % 100;

  // Nombre y nivel
  const nameEl  = document.getElementById("user-name");
  const levelEl = document.getElementById("user-level");
  const titleEl = document.getElementById("level-title");
  const xpGainEl = document.getElementById("xp-gain");
  const xpBarEl  = document.getElementById("xp-progress");

  if (nameEl)   nameEl.innerText  = user.name || user.email;
  if (levelEl)  levelEl.innerText = `Nivel ${level}`;
  if (titleEl)  titleEl.innerText = `LEVEL ${level}`;
  if (xpGainEl) xpGainEl.innerText = `+${xpTotal} XP`;
  if (xpBarEl)  xpBarEl.style.width = `${xpEnNivel}%`;
}

// ===============================
// CARGAR MISIONES EN HOME
// ===============================
function cargarTareasHome() {
  const container = document.querySelector(".missions-card");
  if (!container) return;

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const categoriaActiva = user.categoria_activa || 1;

  Promise.all([
    fetch(`${API}/activities/`).then(r => r.json()),
    fetch(`${API}/accomplishments/`).then(r => r.json())
  ])
  .then(([actividades, logros]) => {
    // Filtrar por categoría activa
    const actividadesFiltradas = actividades.filter(a => a.Id_Category === categoriaActiva);

    const hoy = new Date().toISOString().split("T")[0];
    const completadasHoy = logros
      .filter(l => l.Id_Users === user.Id && l.completed && l.Create_at.startsWith(hoy))
      .map(l => l.Id_activity);

    container.innerHTML = "<h3>Misiones de hoy</h3>";
    if (actividadesFiltradas.length === 0) {
      container.innerHTML += "<p>No hay misiones en esta categoría.</p>";
      return;
    }

    actividadesFiltradas.forEach(tarea => {
      const yaCompletada = completadasHoy.includes(tarea.Id);
      container.innerHTML += `
        <div class="mission" id="mision-${tarea.Id}">
          <span>${tarea.Name}</span>
          <button 
            class="btn-completar ${yaCompletada ? 'completada' : ''}"
            onclick="${yaCompletada ? '' : `completarMision(${tarea.Id})`}"
            ${yaCompletada ? 'disabled' : ''}>
            ${yaCompletada ? '✅ Hecho' : `+${tarea.xp} XP`}
          </button>
        </div>
      `;
    });
  });
}

function completarMision(activityId) {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("user:", user);
  if (!user) return;

  fetch(`${API}/mision/completar/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: user.Id, activity_id: activityId })
  })
  .then(res => res.json())
  .then(data => {
    console.log("respuesta:", data);
    if (data.error) {
      alert(data.error);
      return;
    }

    // Actualizar usuario en localStorage
    user.xp = data.xp_total;
    user.level = data.level;
    localStorage.setItem("user", JSON.stringify(user));

    // Marcar misión como completada visualmente
    const mision = document.getElementById(`mision-${activityId}`);
    if (mision) mision.style.opacity = "0.5";

    // Actualizar XP y nivel en pantalla
    cargarHome();

    alert(`✅ +${data.xp_ganado} XP ganados!`);
  })
  .catch(() => alert("Error al completar misión."));
}

// ===============================
// CARGAR TAREAS EN PANTALLA TAREAS
// ===============================
function cargarTareasLista() {
  const container = document.getElementById("tasks-list");
  if (!container) return;

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const categoriaActiva = user.categoria_activa || 1;

  Promise.all([
    fetch(`${API}/activities/`).then(r => r.json()),
    fetch(`${API}/accomplishments/`).then(r => r.json())
  ])
  .then(([actividades, logros]) => {
    todasLasTareas = actividades.filter(a => a.Id_Category === categoriaActiva);
    todosLosLogros = logros.filter(l => l.Id_Users === user.Id && l.completed);
    filtrarTareas('hoy');
  });
}

function filtrarTareas(filtro) {
  const container = document.getElementById("tasks-list");
  if (!container) return;

  const user = JSON.parse(localStorage.getItem("user"));
  const hoy  = new Date().toISOString().split("T")[0];

  // Actualizar botón activo
  document.querySelectorAll(".filter").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".filter").forEach((btn, i) => {
  btn.classList.remove("active");
  if ((filtro === 'hoy' && i === 0) || 
      (filtro === 'pendientes' && i === 1) || 
      (filtro === 'completadas' && i === 2)) {
    btn.classList.add("active");
  }
});

  const completadasHoy = todosLosLogros
    .filter(l => l.Create_at.startsWith(hoy))
    .map(l => l.Id_activity);

  const todasCompletadas = todosLosLogros.map(l => l.Id_activity);

  let tareasFiltradas = [];

  if (filtro === 'hoy') {
    tareasFiltradas = todasLasTareas;
  } else if (filtro === 'pendientes') {
    tareasFiltradas = todasLasTareas.filter(t => !completadasHoy.includes(t.Id));
  } else if (filtro === 'completadas') {
    tareasFiltradas = todasLasTareas.filter(t => todasCompletadas.includes(t.Id));
  }

  if (tareasFiltradas.length === 0) {
    container.innerHTML = "<p>No hay tareas en esta categoría.</p>";
    return;
  }

  container.innerHTML = tareasFiltradas.map(tarea => {
    const completada = completadasHoy.includes(tarea.Id);
    return `
      <div class="task-item ${completada ? 'completed' : ''}">
        <span>${tarea.Name}</span>
        <button 
          class="btn-completar ${completada ? 'completada' : ''}"
          onclick="${completada ? '' : `completarMision(${tarea.Id})`}"
          ${completada ? 'disabled' : ''}>
          ${completada ? '✅ Hecho' : `+${tarea.xp} XP`}
        </button>
      </div>
    `;
  }).join('');
}

// ===============================
// MOSTRAR USUARIO EN PERFIL
// ===============================
function cargarPerfil() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const xpTotal   = user.xp || 0;
  const level     = Math.floor(xpTotal / 100) + 1;
  const xpEnNivel = xpTotal % 100;

  const nombre  = document.getElementById("perfil-nombre");
  const nivel   = document.getElementById("perfil-nivel");
  const xpBarra = document.getElementById("perfil-xp-barra");
  const xpTexto = document.getElementById("perfil-xp-texto");

  if (nombre)  nombre.innerText  = user.name || user.email;
  if (nivel)   nivel.innerText   = `Nivel ${level}`;
  if (xpBarra) xpBarra.style.width = `${xpEnNivel}%`;
  if (xpTexto) xpTexto.innerText = `${xpEnNivel} / 100 XP`;

  // Cargar stats desde accomplishments
  fetch(`${API}/accomplishments/`)
    .then(r => r.json())
    .then(logros => {
      const misLogros = logros.filter(l => l.Id_Users === user.Id && l.completed);

      // Total tareas completadas
      const totalTareas = misLogros.length;

      // Racha actual
      let racha = 0;
      const hoy = new Date();
      let fechaCheck = new Date(hoy);
      while (true) {
        const fechaStr = fechaCheck.toISOString().split("T")[0];
        const tieneLogro = misLogros.some(l => l.Create_at.startsWith(fechaStr));
        if (!tieneLogro) break;
        racha++;
        fechaCheck.setDate(fechaCheck.getDate() - 1);
      }

      // Días únicos con logros = logros totales
      const diasUnicos = new Set(misLogros.map(l => l.Create_at.split("T")[0])).size;

      const rachaEl  = document.getElementById("perfil-racha");
      const logrosEl = document.getElementById("perfil-logros");
      const tareasEl = document.getElementById("perfil-tareas");

      if (rachaEl)  rachaEl.innerText  = racha;
      if (logrosEl) logrosEl.innerText = diasUnicos;
      if (tareasEl) tareasEl.innerText = totalTareas;
    });
}

// ===============================
// GUARDAR CATEGORÍA
// ===============================
function guardarCategoria(categoriaId) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  fetch(`${API}/users/${user.Id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoria_activa: categoriaId })
  })
  .then(r => r.json())
  .then(data => {
    user.categoria_activa = categoriaId;
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "home.html";
  });
}

// ===============================
// MENU SIDEBAR
// ===============================
function toggleMenu() {
  document.getElementById("sidebar").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
}

// ===============================
// AVATAR MODAL
// ===============================
function openAvatar() {
  document.getElementById("avatarModal").classList.add("active");
  document.getElementById("avatarOverlay").classList.add("active");
}

function closeAvatar() {
  document.getElementById("avatarModal").classList.remove("active");
  document.getElementById("avatarOverlay").classList.remove("active");
}

function cargarProgreso() {
  const container = document.querySelector(".progress-card");
  if (!container) return;

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  fetch(`${API}/accomplishments/`)
    .then(r => r.json())
    .then(logros => {
      // Filtrar solo los del usuario actual y completados
      const misLogros = logros.filter(l => l.Id_Users === user.Id && l.completed);

      // XP por día de la semana actual
      const dias = ['L','M','M','J','V','S','D'];
      const hoy = new Date();
      const semana = Array(7).fill(0);

      misLogros.forEach(logro => {
        const fecha = new Date(logro.Create_at);
        const diaSemana = (fecha.getDay() + 6) % 7; // lunes=0
        const diffDias = Math.floor((hoy - fecha) / (1000*60*60*24));
        if (diffDias < 7) semana[diaSemana] += 10; // XP estimado por logro
      });

      const maxXP = Math.max(...semana, 1);
      const xpHoy = semana[(hoy.getDay() + 6) % 7];

      // Calcular racha
      let racha = 0;
      let fechaCheck = new Date(hoy);
      while (true) {
        const fechaStr = fechaCheck.toISOString().split("T")[0];
        const tieneLogro = misLogros.some(l => l.Create_at.startsWith(fechaStr));
        if (!tieneLogro) break;
        racha++;
        fechaCheck.setDate(fechaCheck.getDate() - 1);
      }

      // Renderizar
      container.innerHTML = `
        <div class="progress-header">
          <h3>Progreso diario</h3>
          <span>+${xpHoy} XP hoy</span>
        </div>
        <div class="chart">
          ${semana.map((xp, i) => `
            <div class="bar" style="height:${Math.max((xp/maxXP)*100, 5)}%">${dias[i]}</div>
          `).join('')}
        </div>
        <div class="streak">
          🏆 Racha actual: <strong>${racha} días</strong>
        </div>
      `;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  // Si ya hay sesión, saltar login directo al home
  const user = localStorage.getItem("user");
  if (user && window.location.pathname.includes("index.html")) {
    window.location.href = "home.html";
  }

  cargarHome();
  cargarTareasHome();
  cargarTareasLista();
  cargarPerfil();
  cargarProgreso();
  cargarRanking(); 
});

// ===============================
// SWITCH TABS LOGIN/REGISTRO
// ===============================
function switchTab(tab) {
  const formLogin    = document.getElementById("form-login");
  const formRegistro = document.getElementById("form-registro");
  const tabs         = document.querySelectorAll(".tab");

  if (tab === "login") {
    formLogin.style.display    = "block";
    formRegistro.style.display = "none";
    tabs[0].classList.add("active");
    tabs[1].classList.remove("active");
  } else {
    formLogin.style.display    = "none";
    formRegistro.style.display = "block";
    tabs[0].classList.remove("active");
    tabs[1].classList.add("active");
  }
}

// ===============================
// INICIAR SESIÓN
// ===============================
function iniciarSesion(e) {
  e.preventDefault();

  const email    = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  fetch(`${API}/users/`)
    .then(res => res.json())
    .then(users => {
      const user = users.find(u => u.email === email);

      if (!user) {
        alert("Usuario no encontrado.");
        return;
      }

      // Guardar y redirigir
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "seccion.html";
    })
    .catch(() => alert("Error al conectar con el servidor."));
}

/////Cargar los ranking///////
function cargarRanking() {
  const topEl  = document.getElementById("top-ranking");
  const listEl = document.getElementById("ranking-list");
  if (!topEl || !listEl) return;

  const user = JSON.parse(localStorage.getItem("user"));

  fetch(`${API}/users/`)
    .then(r => r.json())
    .then(users => {
      // Ordenar por XP descendente
      const ordenados = users.sort((a, b) => (b.xp || 0) - (a.xp || 0));

      const medallas = ['🥇', '#2', '#3'];
      const clases   = ['first', 'second', 'third'];

      // TOP 3
      const top3 = ordenados.slice(0, 3);
      // Reordenar visualmente: 2do, 1ro, 3ro
      const orden = [top3[1], top3[0], top3[2]].filter(Boolean);

      topEl.innerHTML = orden.map(u => {
        const pos     = ordenados.indexOf(u);
        const esYo    = user && u.Id === user.Id;
        return `
          <div class="top-user ${clases[pos]} ${esYo ? 'active-user' : ''}">
            <img src="avatar1.png">
            <span>${medallas[pos]}</span>
            <p>${u.name || u.email}</p>
            <small>${u.xp || 0} XP</small>
          </div>
        `;
      }).join('');

      // LISTA desde el 4to
      const resto = ordenados.slice(3);
      if (resto.length === 0) {
        listEl.innerHTML = "<p>No hay más usuarios.</p>";
        return;
      }

      listEl.innerHTML = resto.map((u, i) => {
        const esYo = user && u.Id === user.Id;
        return `
          <div class="rank-item ${esYo ? 'active-user' : ''}">
            <span>#${i + 4}</span>
            <img src="avatar1.png">
            <p>${u.name || u.email}</p>
            <small>${u.xp || 0} XP</small>
          </div>
        `;
      }).join('');
    });
}
//cerrar sesion//
function cerrarSesion() {
  localStorage.removeItem("user");
  localStorage.removeItem("categoria");
  window.location.href = "index.html";
}
