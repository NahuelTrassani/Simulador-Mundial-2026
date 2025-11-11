// 48 equipos divididos por confederación
const equipos = [
  // UEFA (16)
  "Alemania",
  "Francia",
  "España",
  "Inglaterra",
  "Italia",
  "Portugal",
  "Países Bajos",
  "Bélgica",
  "Croacia",
  "Dinamarca",
  "Suiza",
  "Polonia",
  "Ucrania",
  "Suecia",
  "Austria",
  "Serbia",

  // CONMEBOL (6)
  "Argentina",
  "Brasil",
  "Uruguay",
  "Colombia",
  "Chile (es una simulación, CHILE NO VA)",
  "Ecuador",

  // CONCACAF (8) - Anfitriones + 5
  "México",
  "Estados Unidos",
  "Canadá",
  "Costa Rica",
  "Jamaica",
  "Panamá",
  "Honduras",
  "El Salvador",

  // CAF (9)
  "Senegal",
  "Marruecos",
  "Túnez",
  "Nigeria",
  "Camerún",
  "Ghana",
  "Egipto",
  "Argelia",
  "Costa de Marfil",

  // AFC (8)
  "Japón",
  "Corea del Sur",
  "Irán",
  "Australia",
  "Arabia Saudita",
  "Catar",
  "Irak",
  "Emiratos Árabes",

  // OFC (1)
  "Nueva Zelanda",
];

const button = document.getElementById("start-simulator");

button.addEventListener("click", iniciarSimulador);

function iniciarSimulador() {
  console.log("🏆 === SIMULADOR MUNDIAL 2026 INICIADO ===");

  const nombreUsuario = prompt("👋 ¿Cuál es tu nombre?");
  if (!nombreUsuario) {
    alert("❌ Necesitas ingresar tu nombre para continuar.");
    return;
  }

  alert(
    `⚽ ¡Bienvenido ${nombreUsuario}! ⚽\n` +
      `A partir de ahora el programa dará instrucciones para simular el mundial 2026 por completo.\n` +
      `Los resultados aparecerán en la consola del navegador.`
  );

  const confirmarInicio = confirm(
    `${nombreUsuario}, ¿estás listo para comenzar?`
  );
  if (!confirmarInicio) {
    alert("Simulación cancelada. ¡Hasta pronto!");
    return;
  }

  // Mezclar equipos aleatoriamente
  const equiposRandomizados = shuffle(equipos);

  // Generar grupos de 4 equipos cada uno
  const grupos = generarGrupos(equiposRandomizados);

  // Simular partidos y mostrar resultados
  const resultados = simularFaseGrupos(grupos);
  // mostrarResultados(resultados);

  //Calcular y mostrar tabla de posiciones por grupo
  const tablaFinal = calcularTablaPosiciones(grupos, resultados);

  //mostrarTablaPosiciones(tablaFinal);
  mostrarFaseDeGrupos(tablaFinal, resultados);

  // validar si equipo favorito clasificó
  obtenerEquipoFavorito(equipos, tablaFinal);

  const continuarEliminatorias = confirm(
    "¿Deseas continuar con las fases eliminatorias?"
  );
  if (!continuarEliminatorias) {
    alert(`Gracias por usar el simulador, ${nombreUsuario}. ¡Hasta pronto!`);
    return;
  }

  // Obtener los 32 clasificados (primeros + segundos + mejores terceros)
  const clasificados32 = dieciseisavosFinal(tablaFinal);

  // 16avos de Final (32 equipos → 16 ganadores)
  const ganadores16avos = simularPartido(clasificados32, "16avos de Final");

  // Octavos de final (16 equipos → 8 ganadores)
  const ganadoresOctavos = simularPartido(ganadores16avos, "Octavos de Final");

  // Cuartos de final (8 equipos → 4 ganadores)
  const ganadoresCuartos = simularPartido(ganadoresOctavos, "Cuartos de Final");

  //Armar ronda de semifinales (2 equipos)
  const ganadoresSemifinal = simularPartido(ganadoresCuartos, "Semifinal");

  //Final
  const campeon = simularPartido(ganadoresSemifinal, "Final");
  console.log(`🏆 ¡El campeón del Mundial 2026 es: ${campeon[0]}! 🏆`);

  alert(
    `🏆🏆🏆 CAMPEÓN DEL MUNDIAL 2026 🏆🏆🏆\n\n` +
      `${campeon[0]}\n\n` +
      `¡Gracias por simular el mundial, ${nombreUsuario}!`
  );
}

function generarGrupos(equipos) {
  // equipos.sort(() => Math.random() - 0.5); // Mezclar equipos aleatoriamente --> reemplazo por shuffle

  // Lógica para generar grupos
  const grupos = [];
  let preGrupo = [];

  equipos.forEach((equipo, index) => {
    preGrupo.push(equipo);
    if ((index + 1) % 4 === 0) {
      grupos.push(preGrupo);
      preGrupo = [];
    }
  });
  return grupos;
}

function simularFaseGrupos(grupos) {
  // Lógica para simular partidos
  const resultados = [];

  for (const grupo of grupos) {
    for (let i = 0; i < grupo.length; i++) {
      for (let j = i + 1; j < grupo.length; j++) {
        const equipoA = grupo[i];
        const equipoB = grupo[j];

        //goles
        const golesA = Math.floor(Math.random() * 5); // Goles del equipo A (0-4)
        const golesB = Math.floor(Math.random() * 5); // Goles del equipo B (0-4)

        // Determinar puntos según el resultado
        let puntosA, puntosB, resultado;
        if (golesA > golesB) {
          puntosA = 3;
          puntosB = 0;
          resultado = `🏅 Gana ${equipoA}`;
        } else if (golesA < golesB) {
          puntosA = 0;
          puntosB = 3;
          resultado = `🏅 Gana ${equipoB}`;
        } else {
          puntosA = 1;
          puntosB = 1;
          resultado = "🤝 Empate";
        }

        //guardar resultado
        resultados.push({
          equipoA,
          equipoB,
          golesA,
          golesB,
          resultado,
          puntosA,
          puntosB,
        }); //fin push
      }
    }
  }
  return resultados;
}

function shuffle(array) {
  //recorre el array de atrás hacia adelante
  for (let i = array.length - 1; i > 0; i--) {
    // Genera un índice aleatorio entre 0 e i
    const j = Math.floor(Math.random() * (i + 1));
    // Intercambia los elementos en las posiciones i y j
    [array[i], array[j]] = [array[j], array[i]]; // Intercambia los elementos
  }
  return array;
}

function mostrarResultados(resultados) {
  console.log("\n🏆 === RESULTADOS DE LOS PARTIDOS === 🏆\n");

  resultados.forEach((partido, index) => {
    const { equipoA, equipoB, golesA, golesB, resultado } = partido;

    console.log(
      `Partido ${
        index + 1
      }: ${equipoA} ${golesA} - ${golesB} ${equipoB}  →  ${resultado}`
    );
  });

  console.log("\n=====================================\n");
}

function calcularTablaPosiciones(grupos, resultados) {
  console.log("\n📊 === TABLA DE POSICIONES POR GRUPO === 📊\n");
  const tablaPosiciones = [];

  // Calcular tabla de posiciones para cada grupo
  grupos.forEach((grupo, index) => {
    const tabla = {};

    //Inicializar tabla
    grupo.forEach((equipo) => {
      tabla[equipo] = 0; // Inicializar puntos en 0
    });

    //Asignar puntos según resultados
    resultados.forEach(({ equipoA, equipoB, puntosA, puntosB }) => {
      if (grupo.includes(equipoA)) tabla[equipoA] += puntosA;
      if (grupo.includes(equipoB)) tabla[equipoB] += puntosB;
    });

    //Crear ranking
    //Ordenar equipos por puntos
    const ranking = Object.entries(tabla).sort((a, b) => b[1] - a[1]);

    tablaPosiciones.push({
      grupo: index + 1,
      ranking,
    });
  });
  return tablaPosiciones;
}

function obtenerMejoresTerceros(tablaFinal) {
  const terceros = [];

  // Recolectar todos los terceros puestos
  tablaFinal.forEach(({ grupo, ranking }) => {
    const [equipo, puntos] = ranking[2]; // El tercero (índice 2)
    terceros.push({ equipo, puntos, grupo });
  });

  // Ordenar por puntos (los 8 mejores)
  terceros.sort((a, b) => b.puntos - a.puntos);

  // Retornar solo los 8 mejores
  return terceros.slice(0, 8).map((t) => t.equipo);
}

function mostrarTablaPosiciones(tablaPosiciones) {
  console.log("🏆 === Fase de grupos finalizada, resultados ===");
  tablaPosiciones.forEach(({ grupo, ranking }) => {
    console.log(`\nGrupo ${grupo} - Tabla de Posiciones:`);
    ranking.forEach(([equipo, puntos], posicion) => {
      console.log(`${posicion + 1}. ${equipo} - ${puntos} pts`);
    });
  });
}

function dieciseisavosFinal(resultadoGrupos) {
  const clasificados = [];

  // Obtener primeros y segundos de cada grupo (24 equipos)
  resultadoGrupos.forEach(({ ranking }) => {
    const [equipo1] = ranking[0];
    const [equipo2] = ranking[1];
    clasificados.push(equipo1, equipo2);
  });

  // Obtener los 8 mejores terceros
  const mejoresTerceros = obtenerMejoresTerceros(resultadoGrupos);

  // Agregar los terceros a clasificados (total: 32 equipos)
  clasificados.push(...mejoresTerceros);

  console.log("\n🎯 === CLASIFICADOS A 16AVOS === 🎯");
  console.log(`Total clasificados: ${clasificados.length}`);
  //console.log("Primeros y segundos:", clasificados.slice(0, 24));
  //console.log("Mejores terceros:", mejoresTerceros);

  return clasificados;
}

// Función genérica para generar la siguiente fase
function simularPartido(equiposFase, nombreFase) {
  const ganadores = [];

  console.log(`\n🔥 === ${nombreFase.toUpperCase()} === 🔥\n`);

  for (let i = 0; i < equiposFase.length; i += 2) {
    const equipoA = equiposFase[i];
    const equipoB = equiposFase[i + 1];

    const golesA = Math.floor(Math.random() * 5);
    const golesB = Math.floor(Math.random() * 5);

    let ganador;
    if (golesA > golesB) {
      ganador = equipoA;
      console.log(
        `${equipoA} ${golesA} - ${golesB} ${equipoB}  →  🏅 Gana ${equipoA}`
      );
    } else if (golesA < golesB) {
      ganador = equipoB;
      console.log(
        `${equipoA} ${golesA} - ${golesB} ${equipoB}  →  🏅 Gana ${equipoB}`
      );
    } else {
      ganador = Math.random() > 0.5 ? equipoA : equipoB;
      console.log(
        `${equipoA} ${golesA} - ${golesB} ${equipoB}  →  🎯 Penales: ${ganador}`
      );
    }

    ganadores.push(ganador);
  }

  return ganadores;
}

function mostrarFaseDeGrupos(tablaPosiciones, resultados) {
  console.log("\n📊 === FASE DE GRUPOS === 📊\n");

  tablaPosiciones.forEach(({ grupo, ranking }) => {
    console.log(`🌐 Grupo ${grupo} 🌐\n`);

    // Mostrar todos los partidos del grupo
    const partidosGrupo = resultados
      .filter((r) => ranking.some(([equipo]) => equipo === r.equipoA))
      .map((r) => ({
        "Equipo 1": r.equipoA,
        "Equipo 2": r.equipoB,
        Resultado: `${r.golesA} - ${r.golesB}`,
      }));

    // console.table(partidosGrupo);

    console.log("\n📋 Tabla de Posiciones:\n");
    ranking.forEach(([equipo, puntos], idx) => {
      console.log(`${idx + 1}. ${equipo.padEnd(25)} ${puntos} pts`);
    });
    console.log(""); // Salto de línea
  });
}

function obtenerEquipoFavorito(equiposDisponibles, tablaFinal) {
  let equipoValido = false;
  let equipoFavorito = null;

  while (!equipoValido) {
    equipoFavorito = prompt(
      "¿Cuál es tu equipo favorito?\n(Escribe el nombre exacto o escribe 'SALTAR' para omitir)"
    );

    // Si el usuario cancela o quiere saltar
    if (!equipoFavorito || equipoFavorito.toUpperCase() === "SALTAR") {
      return null;
    }

    // Buscar el equipo (case-insensitive)
    const equipoEncontrado = equiposDisponibles.find(
      (equipo) => equipo.toLowerCase() === equipoFavorito.toLowerCase()
    );

    if (equipoEncontrado) {
      equipoValido = true;
      equipoFavorito = equipoEncontrado; // Usar el nombre exacto del array
      alert(`✅ Equipo seleccionado: ${equipoEncontrado}`);
    } else {
      alert(
        `❌ "${equipoFavorito}" no está en la lista.\n\n` +
          `Algunos equipos disponibles:\n` +
          `${equiposDisponibles.slice(0, 10).join(", ")}...`
      );
    }
  }

  if (equipoFavorito) {
    let clasifico = false;

    tablaFinal.forEach(({ ranking }) => {
      ranking.slice(0, 2).forEach(([equipo]) => {
        if (equipo.toLowerCase() === equipoFavorito.toLowerCase()) {
          clasifico = true;
        }
      });
    });

    if (clasifico) {
      alert(`🎉 ¡${equipoFavorito} clasificó a la siguiente ronda!`);
    } else {
      alert(`😢 ${equipoFavorito} no clasificó...`);
    }
  }
}
