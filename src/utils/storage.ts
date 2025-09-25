import { InternDetails, GeneratedLetter } from '../types';

const INTERNS_KEY = 'internship_interns';
const LETTERS_KEY = 'internship_letters';

export const storageUtils = {
  // Intern management
  getInterns: (): InternDetails[] => {
    const stored = localStorage.getItem(INTERNS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveIntern: (intern: InternDetails): void => {
    const interns = storageUtils.getInterns();
    const existingIndex = interns.findIndex(i => i.id === intern.id);
    
    if (existingIndex >= 0) {
      interns[existingIndex] = intern;
    } else {
      interns.push(intern);
    }
    
    localStorage.setItem(INTERNS_KEY, JSON.stringify(interns));
  },

  deleteIntern: (id: string): void => {
    const interns = storageUtils.getInterns().filter(i => i.id !== id);
    localStorage.setItem(INTERNS_KEY, JSON.stringify(interns));
  },

  // Letter management
  getLetters: (): GeneratedLetter[] => {
    const stored = localStorage.getItem(LETTERS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveLetter: (letter: GeneratedLetter): void => {
    const letters = storageUtils.getLetters();
    const existingIndex = letters.findIndex(l => l.id === letter.id);
    
    if (existingIndex >= 0) {
      letters[existingIndex] = letter;
    } else {
      letters.push(letter);
    }
    
    localStorage.setItem(LETTERS_KEY, JSON.stringify(letters));
  },

  getLettersByIntern: (internId: string): GeneratedLetter[] => {
    return storageUtils.getLetters().filter(l => l.internId === internId);
  }
};