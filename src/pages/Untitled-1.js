useEffect(() => {
  supabase.auth.getSession()
    .then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Supabase getSession failed', err);
      setSession(null);
      setLoading(false);
    });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  return () => subscription.unsubscribe();
}, []);