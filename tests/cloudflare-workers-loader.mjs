export async function resolve(specifier, context, nextResolve) {
  if (specifier === "cloudflare:workers") {
    return {
      url: "data:text/javascript,export%20%7B%7D",
      shortCircuit: true,
    };
  }

  return nextResolve(specifier, context);
}
