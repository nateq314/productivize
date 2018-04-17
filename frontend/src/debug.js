const log = msg => {
  if (process.env.NODE_ENV !== "production") {
    console.log(msg);
  }
};

const info = msg => {
  if (process.env.NODE_ENV !== "production") {
    console.info(msg);
  }
};

const warn = msg => {
  if (process.env.NODE_ENV !== "production") {
    console.warn(msg);
  }
};

const error = msg => {
  if (process.env.NODE_ENV !== "production") {
    console.error(msg);
  }
};

const table = data => {
  if (process.env.NODE_ENV !== "production") {
    console.table(data);
  }
};

export { log, info, warn, error, table };
