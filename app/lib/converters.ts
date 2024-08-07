export function errorToString(error: any): string {
  let message = JSON.stringify(error, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
  if (error?.message) {
    message = error.message;
  }
  if (error?.cause?.shortMessage) {
    message = error.cause.shortMessage;
  }
  return message;
}
