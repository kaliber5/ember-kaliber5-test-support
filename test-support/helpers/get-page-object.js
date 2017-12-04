import allPages from '../pages/all';
import { camelize } from '@ember/string';

export default function getPageObject(page) {
  let pageObjectName = camelize(page.replace('/', '-'));
  return allPages[pageObjectName];
}
