const INTERNS_KEY = 'internship_interns';
const LETTERS_KEY = 'internship_letters';

export const storageUtils = {
  // Intern management
  getInterns: () => {
    const stored = localStorage.getItem(INTERNS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveIntern: (intern) => {
    const interns = storageUtils.getInterns();
    const existingIndex = interns.findIndex(i => i.id === intern.id);
    
    if (existingIndex >= 0) {
      interns[existingIndex] = intern;
    } else {
      interns.push(intern);
    }
    
    localStorage.setItem(INTERNS_KEY, JSON.stringify(interns));
  },

  deleteIntern: (id) => {
    const interns = storageUtils.getInterns().filter(i => i.id !== id);
    localStorage.setItem(INTERNS_KEY, JSON.stringify(interns));
  },

  // Letter management
  getLetters: () => {
    const stored = localStorage.getItem(LETTERS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveLetter: (letter) => {
    const letters = storageUtils.getLetters();
    const existingIndex = letters.findIndex(l => l.id === letter.id);
    
    if (existingIndex >= 0) {
      letters[existingIndex] = letter;
    } else {
      letters.push(letter);
    }
    
    localStorage.setItem(LETTERS_KEY, JSON.stringify(letters));
  },

  getLettersByIntern: (internId) => {
    return storageUtils.getLetters().filter(l => l.internId === internId);
  }
};
