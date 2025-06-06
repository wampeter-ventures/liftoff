const puzzles = [
  {
    id: 1,
    height: 3,
    dice: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1, 6: 3 },
    image: "https://picsum.photos/seed/rocket1/300/200"
  },
  {
    id: 2,
    height: 4,
    dice: { 1: 2, 2: 2, 3: 4, 4: 2, 5: 1, 6: 4 },
    image: "https://picsum.photos/seed/rocket2/300/200"
  },
  {
    id: 3,
    height: 5,
    dice: { 1: 2, 2: 3, 3: 3, 4: 3, 5: 2, 6: 5 },
    image: "https://picsum.photos/seed/rocket3/300/200"
  }
];

export function getPuzzleForToday() {
  const today = new Date();
  const index = today.getFullYear() + today.getMonth() + today.getDate();
  return puzzles[index % puzzles.length];
}

export default puzzles;
