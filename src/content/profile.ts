export const profile = {
  name: 'Muskan Pandey',
  email: 'mpandey9385@gmail.com',
  github: 'https://github.com/Muskanpandey0304',
  linkedin: 'https://www.linkedin.com/in/muskan-pandey-84a90733b',
  location: 'Maharashtra, India', // TODO: confirm public location line with Muskan
  status: 'Open to roles · 2026 grad',
  education: 'B.E. CSE (AIML), Honours in Data Science · 2026',
  resumes: {
    ml: 'resume/Muskan_Pandey_Resume_AIML.pdf',
    data: 'resume/Muskan_Pandey_Resume_Data_Analyst.pdf'
  }
} as const;

export const repo = (name: string) => `${profile.github}/${name}`;
