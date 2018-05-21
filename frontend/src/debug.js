const log = (msg, ...args) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(msg, ...args);
  }
};

const info = (msg, ...args) => {
  if (process.env.NODE_ENV !== "production") {
    console.info(msg, ...args);
  }
};

const warn = (msg, ...args) => {
  if (process.env.NODE_ENV !== "production") {
    console.warn(msg, ...args);
  }
};

const error = (msg, ...args) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(msg, ...args);
  }
};

const table = (data, ...args) => {
  if (process.env.NODE_ENV !== "production") {
    console.table(data, ...args);
  }
};

export { log, info, warn, error, table };
