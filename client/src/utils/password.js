// Happy coding :D!
// Happy coding :D
export const checkPasswordStrength = (password) => {
  let score = 0;

  // Length score
  if (password.length >= 12) {
    score += 3;
  } else if (password.length >= 9) {
    score += 2;
  } else if (password.length >= 6) {
    score += 1;
  }

  // Character type presence
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  let characterTypeCount = 0;
  if (hasUppercase) {
    score++;
    characterTypeCount++;
  }
  if (hasLowercase) {
    score++;
    characterTypeCount++;
  }
  if (hasNumber) {
    score++;
    characterTypeCount++;
  }
  if (hasSymbol) {
    score++;
    characterTypeCount++;
  }

  // Combinations bonus
  if (characterTypeCount >= 3) {
    score++; // Bonus for 3 or more character types
  }
  if (characterTypeCount === 4) {
    score++; // Additional bonus for all 4 character types
  }
  if (password.length >= 12 && characterTypeCount === 4) {
    score++; // Extra bonus for long passwords with all 4 types
  }

  return score;
};