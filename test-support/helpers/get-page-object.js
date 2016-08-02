import allPages from '../pages/all';

export default function getPageObject(page) {
  let pageObjectName = page.replace('/', '-').camelize();
  return allPages[pageObjectName];
}
