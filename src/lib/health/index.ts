type HealthPassword = {
  score: number;
  percentage: number;
  percentageText: string;
};
type HealthAllPasswords = {
  score: number;
  percentage: number;
  percentageText: string;
  weekPasswords: number[];
};

const hasOneLowercaseChar = (s: string): boolean => {
  const isLower = /(?=.*[a-z])/.test(s);
  return isLower;
};
const hasOneUppercaseChar = (s: string): boolean => {
  const isUpper = /(?=.*[A-Z])/.test(s);
  return isUpper;
};
const hasOneNumber = (s: string): boolean => {
  const isNum = /(?=.*[0-9])/.test(s);
  return isNum;
};
const hasOneSpecialChar = (s: string): boolean => {
  const isSpecial = /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(s);
  return isSpecial;
};

export const checkOnePasswordHealth = (p: string): HealthPassword => {
  const isLower = hasOneLowercaseChar(p) ? 10 : 0;
  const isUpper = hasOneUppercaseChar(p) ? 10 : 0;
  const isSpecial = hasOneSpecialChar(p) ? 10 : 0;
  const isNum = hasOneNumber(p) ? 10 : 0;
  const length = p.length;
  let lengthScore = 0;
  if (length < 4) {
    lengthScore = 10;
  } else if (length < 8) {
    lengthScore = 20;
  } else if (length < 16) {
    lengthScore = 25;
  } else if (length < 22) {
    lengthScore = 30;
  } else if (length >= 22) {
    lengthScore = 40;
  }
  const total = isLower + isUpper + isSpecial + isNum + lengthScore;
  const percentage = Number(((total / 80) * 100).toFixed(2));
  return {
    percentage,
    percentageText: `${percentage}%`,
    score: total,
  };
};

export const checkAllPasswordHealth = (passwords: { password: string; id: number }[]): HealthAllPasswords => {
  let total = passwords.length * 80;
  let score = 0;
  let weekPasswords: number[] = [];
  for (const p of passwords) {
    const s = checkOnePasswordHealth(p.password);
    if (s.percentage < 50) {
      weekPasswords.push(p.id);
    }
    score += s.score;
  }
  const percentage = Number(((score / total) * 100).toFixed(2));
  return {
    percentage,
    percentageText: `${percentage}%`,
    score: score,
    weekPasswords,
  };
};
