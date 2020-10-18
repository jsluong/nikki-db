import database from '../../modules/database';
import { fetchItemData } from '../../modules/api';
import { API_CONSTANTS } from '../../modules/constants';
import { posedDress } from '../test_data/data';

describe('API: fetchItemData', () => {
  let collection: any;
  let get: any;
  let doc: any;

  test('Successfully fetches item data from API', () => {
    const response = {
      exists: true,
      data: () => posedDress,
    };
    get = jest.fn().mockResolvedValue(response);
    doc = jest.fn(() => ({
      get,
    }));
    collection = jest.spyOn(database, 'collection')
      .mockReturnValue((({
        doc,
      } as any) as any));

    const itemId = 10001;
    fetchItemData(itemId);
    expect(collection).toHaveBeenCalledWith(API_CONSTANTS.CLOTHES);
    expect(doc).toHaveBeenCalledWith(itemId.toString());
    expect(get()).resolves.toBe(response);
  });

  test('Returns null if it cannot find the document', () => {
    get = jest.fn().mockResolvedValue(null);
    doc = jest.fn(() => ({
      get,
    }));
    collection = jest.spyOn(database, 'collection')
      .mockReturnValue((({
        doc,
      } as any) as any));

    const itemId = 10001;
    fetchItemData(itemId);
    expect(collection).toHaveBeenCalledWith(API_CONSTANTS.CLOTHES);
    expect(doc).toHaveBeenCalledWith(itemId.toString());
    expect(get()).resolves.toBe(null);
  });

  test('Catches an exception if the API call fails', () => {
    get = jest.fn().mockRejectedValue(new Error());
    doc = jest.fn(() => ({
      get,
    }));
    collection = jest.spyOn(database, 'collection')
      .mockReturnValue((({
        doc,
      } as any) as any));

    const itemId = 10001;
    fetchItemData(itemId);
    expect(get()).rejects.toThrowError();
  });
});
