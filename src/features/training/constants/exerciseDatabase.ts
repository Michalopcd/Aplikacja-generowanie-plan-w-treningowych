import type { Exercise } from "../trainingPlan";

export const exerciseDatabase: Exercise[] = [
  {
    id: "push-up",
    name: "Pompki klasyczne",
    trainingLocations: ["home"],
    muscleGroups: ["chest", "triceps", "shoulders"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "knee-push-up",
    name: "Pompki na kolanach",
    trainingLocations: ["home"],
    muscleGroups: ["chest", "triceps", "shoulders"],
    experienceLevels: ["beginner"],
  },
  {
    id: "diamond-push-up",
    name: "Pompki diamentowe",
    trainingLocations: ["home"],
    muscleGroups: ["chest", "triceps"],
    experienceLevels: ["intermediate", "advanced"],
  },
  {
    id: "pike-push-up",
    name: "Pompki pike",
    trainingLocations: ["home"],
    muscleGroups: ["shoulders", "triceps"],
    experienceLevels: ["intermediate", "advanced"],
  },
  {
    id: "bodyweight-squat",
    name: "Przysiady z masą ciała",
    trainingLocations: ["home"],
    muscleGroups: ["quadriceps", "glutes"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "jump-squat",
    name: "Przysiady z wyskokiem",
    trainingLocations: ["home"],
    muscleGroups: ["quadriceps", "glutes"],
    experienceLevels: ["intermediate", "advanced"],
  },
  {
    id: "reverse-lunge",
    name: "Wykroki w tył",
    trainingLocations: ["home"],
    muscleGroups: ["quadriceps", "glutes"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "bulgarian-split-squat",
    name: "Przysiady bułgarskie",
    trainingLocations: [ "gym"],
    muscleGroups: ["quadriceps", "glutes"],
    experienceLevels: ["intermediate", "advanced"],
  },
  {
    id: "glute-bridge",
    name: "Most biodrowy",
    trainingLocations: ["home", "gym"],
    muscleGroups: ["glutes", "hamstrings"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "standing-calf-raise",
    name: "Wspięcia na palce",
    trainingLocations: ["home", "gym"],
    muscleGroups: ["calves"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "crunches",
    name: "Brzuszki",
    trainingLocations: ["home", "gym"],
    muscleGroups: ["core"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "plank",
    name: "Deska",
    trainingLocations: ["home", "gym"],
    muscleGroups: ["core"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "side-plank",
    name: "Deska bokiem",
    trainingLocations: ["home", "gym"],
    muscleGroups: ["core"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "dead-bug",
    name: "Dead bug",
    trainingLocations: ["home", "gym"],
    muscleGroups: ["core"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "leg-raise",
    name: "Unoszenie nóg leżąc",
    trainingLocations: ["home", "gym"],
    muscleGroups: ["core"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "mountain-climber",
    name: "Mountain climbers",
    trainingLocations: ["home", "gym"],
    muscleGroups: ["core", "shoulders"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "burpee",
    name: "Krokodylki",
    trainingLocations: ["home", "gym"],
    muscleGroups: ["chest", "shoulders", "quadriceps", "glutes", "core"],
    experienceLevels: ["intermediate", "advanced"],
  },
  {
    id: "superman",
    name: "Superman",
    trainingLocations: ["home", "gym"],
    muscleGroups: ["back", "glutes"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "wall-sit",
    name: "Krzesło przy ścianie",
    trainingLocations: ["home",],
    muscleGroups: ["quadriceps"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },

  // SIŁOWNIA — KLATKA PIERSIOWA

  {
    id: "barbell-bench-press",
    name: "Wyciskanie sztangi leżąc",
    trainingLocations: ["gym"],
    muscleGroups: ["chest", "triceps", "shoulders"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "incline-dumbbell-press",
    name: "Wyciskanie hantli na ławce dodatniej",
    trainingLocations: ["gym"],
    muscleGroups: ["chest", "triceps", "shoulders"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "dumbbell-fly",
    name: "Rozpiętki z hantlami",
    trainingLocations: ["gym"],
    muscleGroups: ["chest"],
    experienceLevels: ["intermediate", "advanced"],
  },
  {
    id: "cable-fly",
    name: "Rozpiętki na bramie",
    trainingLocations: ["gym"],
    muscleGroups: ["chest"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },

  // SIŁOWNIA — PLECY

  {
    id: "assisted-pull-up",
    name: "Podciąganie na maszynie z asystą",
    trainingLocations: ["gym"],
    muscleGroups: ["back", "biceps"],
    experienceLevels: ["beginner", "intermediate"],
  },
  {
    id: "pull-up",
    name: "Podciąganie na drążku",
    trainingLocations: ["gym"],
    muscleGroups: ["back", "biceps"],
    experienceLevels: ["intermediate", "advanced"],
  },
  {
    id: "lat-pulldown",
    name: "Ściąganie drążka wyciągu górnego",
    trainingLocations: ["gym"],
    muscleGroups: ["back", "biceps"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "one-arm-dumbbell-row",
    name: "Wiosłowanie hantlem jednorącz",
    trainingLocations: ["gym"],
    muscleGroups: ["back", "biceps"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "seal-row",
    name: "Focze wiosło",
    trainingLocations: ["gym"],
    muscleGroups: ["back", "biceps"],
    experienceLevels: ["intermediate", "advanced"],
  },
  {
    id: "straight-arm-pulldown",
    name: "Narciarz na wyciągu",
    trainingLocations: ["gym"],
    muscleGroups: ["back"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "barbell-row",
    name: "Wiosłowanie sztangą",
    trainingLocations: ["gym"],
    muscleGroups: ["back", "biceps"],
    experienceLevels: ["intermediate", "advanced"],
  },
  {
    id: "seated-cable-row",
    name: "Wiosłowanie na wyciągu siedząc",
    trainingLocations: ["gym"],
    muscleGroups: ["back", "biceps"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "chest-supported-row",
    name: "Wiosłowanie na ławce skośnej",
    trainingLocations: ["gym"],
    muscleGroups: ["back", "biceps"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },

  // SIŁOWNIA — BARKI

  {
    id: "overhead-press",
    name: "Wyciskanie żołnierskie OHP",
    trainingLocations: ["gym"],
    muscleGroups: ["shoulders", "triceps"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "lateral-raise",
    name: "Wznosy bokiem z hantlami",
    trainingLocations: ["gym"],
    muscleGroups: ["shoulders"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "face-pull",
    name: "Face pull",
    trainingLocations: ["gym"],
    muscleGroups: ["shoulders", "back"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "reverse-fly",
    name: "Odwrotne rozpiętki",
    trainingLocations: ["gym"],
    muscleGroups: ["shoulders", "back"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },

  // SIŁOWNIA — BICEPS

  {
    id: "dumbbell-bicep-curl",
    name: "Uginanie ramion z hantlami",
    trainingLocations: ["gym"],
    muscleGroups: ["biceps"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "barbell-bicep-curl",
    name: "Uginanie ramion ze sztangą",
    trainingLocations: ["gym"],
    muscleGroups: ["biceps"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "hammer-curl",
    name: "Uginanie młotkowe",
    trainingLocations: ["gym"],
    muscleGroups: ["biceps"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },

  // SIŁOWNIA — TRICEPS

  {
    id: "french-press",
    name: "Wyciskanie francuskie",
    trainingLocations: ["gym"],
    muscleGroups: ["triceps"],
    experienceLevels: ["intermediate", "advanced"],
  },
  {
    id: "triceps-pushdown",
    name: "Prostowanie ramion na wyciągu",
    trainingLocations: ["gym"],
    muscleGroups: ["triceps"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "overhead-triceps-extension",
    name: "Prostowanie ramion nad głową na wyciągu",
    trainingLocations: ["gym"],
    muscleGroups: ["triceps"],
    experienceLevels: ["intermediate", "advanced"],
  },

  // SIŁOWNIA — NOGI

  {
    id: "barbell-squat",
    name: "Przysiad ze sztangą",
    trainingLocations: ["gym"],
    muscleGroups: ["quadriceps", "glutes"],
    experienceLevels: ["intermediate", "advanced"],
  },
  {
    id: "leg-press",
    name: "Wypychanie na suwnicy",
    trainingLocations: ["gym"],
    muscleGroups: ["quadriceps", "glutes"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "romanian-deadlift",
    name: "Martwy ciąg rumuński",
    trainingLocations: ["gym"],
    muscleGroups: ["hamstrings", "glutes"],
    experienceLevels: ["intermediate", "advanced"],
  },
  {
    id: "leg-curl",
    name: "Uginanie nóg na maszynie",
    trainingLocations: ["gym"],
    muscleGroups: ["hamstrings"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "leg-extension",
    name: "Prostowanie nóg na maszynie",
    trainingLocations: ["gym"],
    muscleGroups: ["quadriceps"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "hip-thrust",
    name: "Hip thrust",
    trainingLocations: ["gym"],
    muscleGroups: ["glutes"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },

  // SIŁOWNIA — BRZUCH

  {
    id: "cable-crunch",
    name: "Brzuszki na wyciągu",
    trainingLocations: ["gym"],
    muscleGroups: ["core"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "hanging-knee-raise",
    name: "Unoszenie kolan w zwisie",
    trainingLocations: ["gym"],
    muscleGroups: ["core"],
    experienceLevels: ["intermediate", "advanced"],
  },
];

export const homeExercises = exerciseDatabase.filter((exercise) =>
  exercise.trainingLocations.includes("home"),
);

export const gymExercises = exerciseDatabase.filter((exercise) =>
  exercise.trainingLocations.includes("gym"),
);