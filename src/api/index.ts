
const BASE_URL = 'https://json.extendsclass.com/bin'


const headers = {
  'api-key': '2a4e00f1-83f1-11ec-b95c-0242ac110002',
}

const handleError = <T>(response: Response) => {
  if (!response.ok) return Promise.reject(response)
  return response.json() as Promise<T>
}

export const saveFile = async (data: Record<string, unknown>) => {
  const body = JSON.stringify(data)

  type ISaveFileResponse = {
    id: string;
    status: number;
    uri: string;
  }

  return fetch(BASE_URL, { method: 'POST', body, headers }).then((response) => (
    handleError<ISaveFileResponse>(response)
  ))
}

export const getFile = async <T>(id: string) => {
  const url = `${BASE_URL}/${id}`

  return fetch(url, { method: 'GET', headers }).then((response) => (
    handleError<T>(response)
  ))
}
