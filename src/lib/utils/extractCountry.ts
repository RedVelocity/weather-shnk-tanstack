function extractCountry(address: string): string {
  // Split the address string by commas
  const parts = address.split(',');

  // Trim whitespace from each part
  const trimmedParts = parts.map((part) => {
    part.trim();
    return part.replaceAll('.', '');
  });

  // Return the last part, which should be the country
  return trimmedParts[trimmedParts.length - 1];
}

export default extractCountry;
