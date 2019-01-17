import got from 'got';
import { createGitlabService } from '../create-service';

jest.mock('got', () => {
  const mock = ['get', 'post', 'put', 'patch', 'head', 'delete'].reduce(
    (o, method) => {
      o[method] = jest.fn().mockResolvedValue({ data: `<mocked ${method}>` });
      return o;
    },
    {}
  );
  return {
    ...mock,
  };
});

let service: ReturnType<typeof createGitlabService>;

beforeEach(() => {
  (got.get as jest.Mock).mockClear();
  (got.post as jest.Mock).mockClear();

  service = createGitlabService({
    baseUrl: 'https://gitlab.example.com',
    token: 'T0kn',
    userAgent: 'Testing laborious',
  });
});

test('smoke test', () => {
  expect(service).toEqual(expect.any(Object));
});

test('get version', async () => {
  await service.version();
  expect(got.get).toHaveBeenCalled();
  expect(got.get).toMatchLastCallSnapshot();
});

test('get a project', async () => {
  await service.project('ids can also be strings');
  expect(got.get).toHaveBeenCalled();
  expect(got.get).toMatchLastCallSnapshot();
});

test('create a merge request', async () => {
  await service.project.createMergeRequest({
    id: 12346,
    source_branch: 'feature/123',
    target_branch: 'master',
    title: 'this is a merge request',
  });
  expect(got.post).toHaveBeenCalled();
  expect(got.post).toMatchLastCallSnapshot();
});

test('get list of merge requests', async () => {
  await service.project.listMergeRequests('id id id');
  expect(got.get).toHaveBeenCalled();
  expect(got.get).toMatchLastCallSnapshot();
});

test('get list of closed merge requests', async () => {
  await service.project.listMergeRequests('id id id', { state: 'closed' });
  expect(got.get).toHaveBeenCalled();
  expect(got.get).toMatchLastCallSnapshot();
});

test('get list of branches', async () => {
  await service.project.listBranches('blubb');
  expect(got.get).toHaveBeenCalled();
  expect(got.get).toMatchLastCallSnapshot();
});
