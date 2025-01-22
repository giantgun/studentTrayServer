export function IsProductAllowed(
  productSchoolArray: any[],
  userSchoolId: number,
) {
  for (let i = 0; i < productSchoolArray.length!; i++) {
    if (productSchoolArray[i].schoolId === userSchoolId) {
      return true;
    }
  }
  return false;
}
