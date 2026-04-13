const Banner = () => {
  return (
    <section
      className="relative min-h-[75vh] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1800&q=80')",
      }}
    >
      <div className="container flex min-h-[75vh] items-center px-6 pt-28">
        <div className="max-w-2xl space-y-4 text-white">
          <p className="text-sm uppercase tracking-[0.35em] text-white/80">
            Make Every Event Memorable
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
            Planora Elevates Your Event Experience
          </h1>
          <p className="max-w-xl text-white/80">
            Plan, manage, and celebrate beautifully with one platform for
            conferences, weddings, meetups, and more.
          </p>
        </div>
      </div>
    </section>
  );
};

export { Banner };
