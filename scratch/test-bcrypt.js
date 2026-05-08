async function test() {
  const bcrypt = await import("bcryptjs");
  console.log("Bcrypt keys:", Object.keys(bcrypt));
  console.log("Bcrypt default:", !!bcrypt.default);
}
test();
