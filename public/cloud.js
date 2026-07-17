(function () {
  let client = null;
  let authHandler = () => {};

  function configured() {
    const c = window.APP_CONFIG || {};
    return Boolean(c.SUPABASE_URL && c.SUPABASE_ANON_KEY && window.supabase);
  }

  async function init(handler) {
    authHandler = handler || authHandler;
    if (!configured()) return authHandler(null, false);
    client = window.supabase.createClient(
      window.APP_CONFIG.SUPABASE_URL,
      window.APP_CONFIG.SUPABASE_ANON_KEY
    );
    const { data } = await client.auth.getSession();
    authHandler(data.session?.user || null, true);
    client.auth.onAuthStateChange((_event, session) => {
      authHandler(session?.user || null, true);
    });
  }

  async function signUp(email, password) {
    if (!client) throw new Error("请先配置 Supabase");
    const { error } = await client.auth.signUp({ email, password });
    if (error) throw error;
  }

  async function signIn(email, password) {
    if (!client) throw new Error("请先配置 Supabase");
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signOut() {
    if (client) await client.auth.signOut();
  }

  async function loadUserData() {
    if (!client) return null;
    const tables = ["vocab_words", "stories", "bookmarks", "sentence_saves", "comments"];
    const results = await Promise.all(tables.map(table => client.from(table).select("*")));
    const failed = results.find(x => x.error);
    if (failed) throw failed.error;
    return Object.fromEntries(tables.map((table, i) => [table, results[i].data || []]));
  }

  async function insert(table, record) {
    if (!client) return;
    const { error } = await client.from(table).insert(record);
    if (error) console.error(error);
  }

  async function upsert(table, record, onConflict) {
    if (!client) return;
    const { error } = await client.from(table).upsert(record, { onConflict });
    if (error) console.error(error);
  }

  async function remove(table, column, value) {
    if (!client) return;
    const { error } = await client.from(table).delete().eq(column, value);
    if (error) console.error(error);
  }

  window.Cloud = {
    configured, init, signUp, signIn, signOut, loadUserData, insert, upsert, remove
  };
})();
