const Api = {
  getUser() {
    try {
      return JSON.parse(localStorage.getItem('ludobet_player_user')) || { id: 1, name: 'Player_Demo' };
    } catch {
      return { id: 1, name: 'Player_Demo' };
    }
  },

  async login(mobile, name) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, name })
    });
    return await res.json();
  }
};
