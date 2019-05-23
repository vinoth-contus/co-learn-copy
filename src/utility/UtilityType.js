import _ from 'lodash';
import { ls } from './LocalStorage';

/**
 * Handle the customer utility type related process
 */
class UtilityType {
  constructor() {
    this.headerComponent = null;
  }
  /**
   * Set current component to access the properties and methods
   *
   * @param object
   */
  setHeaderComponent(headerComponent) {
    this.headerComponent = headerComponent;
  }
  /**
   * return currently stored utility type
   *
   * @return string
   */
  getUtilityType() {
    return !_.isEmpty(ls.getItem('userUtilityType'))
      ? ls.getItem('userUtilityType')
      : '';
  }

  /**
   * Store the utility type into local storage
   *
   * @param sting utilityTypeId
   */
  setUtilityType(utilityTypeId, disableUtilityFilter) {
    ls.removeItem('userUtilityType');
    ls.setItem('userUtilityType', utilityTypeId);
    if (!_.isEmpty(this.headerComponent)) {
      this.setHeaderUtilityType(utilityTypeId, disableUtilityFilter);
    }
  }

  /**
   * Set Utility type for page
   *
   * @param sting utilityTypeId
   */
  setPageUtilityType(utilityTypeId) {
    ls.removeItem('pageUtilityType');
    ls.setItem('pageUtilityType', utilityTypeId);
    this.setUtilityType(utilityTypeId, false);
  }

  /**
   * Store Utility type for form
   *
   * @param sting utilityTypeId
   */
  setFormUtilityType(utilityTypeId) {
    ls.removeItem('formUtilityType');
    ls.setItem('formUtilityType', utilityTypeId);
    this.setUtilityType(utilityTypeId, true);
  }

  /**
   * Set & Select given utility type in the header utility filter
   *
   * @param string utilityTypeId
   */
  setHeaderUtilityType(utilityTypeId, disableUtilityFilter) {
    if (this.headerComponent._ismounted) {
      // Normal page need to enable the header utility type filer, So 'disableUtilityFilter' must be FALSE
      // Form page need to disable the header utility type filer, So 'disableUtilityFilter' must be TRUE
      this.headerComponent.disableUtilityFilter = disableUtilityFilter;
      this.headerComponent.updateUtility(utilityTypeId);
    }
  }

  /**
   * Check whether given path is contain 'add' or 'edit' string
   * If it contains the string, return true.
   *
   * @param string | path
   */
  isAddOrEditPage(path) {
    return path.indexOf('add') > -1 || path.indexOf('edit') > -1;
  }

  /**
   * Reset the utility type to page based utility
   * @param {*} path
   */
  resetUtilityType() {
    if (!_.isEmpty(ls.getItem('pageUtilityType'))) {
      // Normal page need to disable the header utility type filer, So pass second argument as FALSE
      this.setUtilityType(ls.getItem('pageUtilityType'), false);
    }
  }
}

export default new UtilityType();
