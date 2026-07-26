import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateCommentData {
  comment_insert: Comment_Key;
}

export interface CreateCommentVariables {
  taskId: UUIDString;
  content: string;
}

export interface CreateProjectData {
  project_insert: Project_Key;
}

export interface CreateProjectMemberData {
  projectMember_insert: ProjectMember_Key;
}

export interface CreateProjectMemberVariables {
  projectId: UUIDString;
}

export interface CreateProjectVariables {
  title: string;
  description?: string | null;
}

export interface CreateTaskData {
  task_insert: Task_Key;
}

export interface CreateTaskVariables {
  title: string;
  projectId: UUIDString;
  status: string;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface DeleteCommentData {
  comment_delete?: Comment_Key | null;
}

export interface DeleteCommentVariables {
  id: UUIDString;
}

export interface DeleteProjectData {
  project_delete?: Project_Key | null;
}

export interface DeleteProjectMemberData {
  projectMember_delete?: ProjectMember_Key | null;
}

export interface DeleteProjectMemberVariables {
  id: UUIDString;
}

export interface DeleteProjectVariables {
  id: UUIDString;
}

export interface DeleteTaskData {
  task_delete?: Task_Key | null;
}

export interface DeleteTaskVariables {
  id: UUIDString;
}

export interface GetProjectData {
  project?: {
    title: string;
    description?: string | null;
  };
}

export interface GetProjectVariables {
  id: UUIDString;
}

export interface GetTaskData {
  task?: {
    title: string;
    status: string;
    priority?: number | null;
  };
}

export interface GetTaskVariables {
  id: UUIDString;
}

export interface GetUserData {
  user?: {
    email: string;
    displayName: string;
  };
}

export interface ListCommentsData {
  comments: ({
    content: string;
    user: {
      displayName: string;
    };
  })[];
}

export interface ListCommentsVariables {
  taskId: UUIDString;
}

export interface ListProjectMembersData {
  projectMembers: ({
    user: {
      displayName: string;
    };
  })[];
}

export interface ListProjectMembersVariables {
  projectId: UUIDString;
}

export interface ListProjectsData {
  projects: ({
    title: string;
    deadline?: DateString | null;
  })[];
}

export interface ListTasksData {
  tasks: ({
    title: string;
    status: string;
  })[];
}

export interface ListTasksVariables {
  projectId: UUIDString;
}

export interface ProjectMember_Key {
  id: UUIDString;
  __typename?: 'ProjectMember_Key';
}

export interface Project_Key {
  id: UUIDString;
  __typename?: 'Project_Key';
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface UpdateProjectData {
  project_update?: Project_Key | null;
}

export interface UpdateProjectVariables {
  id: UUIDString;
  title?: string | null;
}

export interface UpdateTaskData {
  task_update?: Task_Key | null;
}

export interface UpdateTaskVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface UpdateUserVariables {
  displayName: string;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface UpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  operationName: string;
}
export const updateUserRef: UpdateUserRef;

export function updateUser(vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;
export function updateUser(dc: DataConnect, vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;
export function getUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface CreateProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProjectVariables): MutationRef<CreateProjectData, CreateProjectVariables>;
  operationName: string;
}
export const createProjectRef: CreateProjectRef;

export function createProject(vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;
export function createProject(dc: DataConnect, vars: CreateProjectVariables): MutationPromise<CreateProjectData, CreateProjectVariables>;

interface UpdateProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProjectVariables): MutationRef<UpdateProjectData, UpdateProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProjectVariables): MutationRef<UpdateProjectData, UpdateProjectVariables>;
  operationName: string;
}
export const updateProjectRef: UpdateProjectRef;

export function updateProject(vars: UpdateProjectVariables): MutationPromise<UpdateProjectData, UpdateProjectVariables>;
export function updateProject(dc: DataConnect, vars: UpdateProjectVariables): MutationPromise<UpdateProjectData, UpdateProjectVariables>;

interface DeleteProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProjectVariables): MutationRef<DeleteProjectData, DeleteProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProjectVariables): MutationRef<DeleteProjectData, DeleteProjectVariables>;
  operationName: string;
}
export const deleteProjectRef: DeleteProjectRef;

export function deleteProject(vars: DeleteProjectVariables): MutationPromise<DeleteProjectData, DeleteProjectVariables>;
export function deleteProject(dc: DataConnect, vars: DeleteProjectVariables): MutationPromise<DeleteProjectData, DeleteProjectVariables>;

interface GetProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProjectVariables): QueryRef<GetProjectData, GetProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProjectVariables): QueryRef<GetProjectData, GetProjectVariables>;
  operationName: string;
}
export const getProjectRef: GetProjectRef;

export function getProject(vars: GetProjectVariables, options?: ExecuteQueryOptions): QueryPromise<GetProjectData, GetProjectVariables>;
export function getProject(dc: DataConnect, vars: GetProjectVariables, options?: ExecuteQueryOptions): QueryPromise<GetProjectData, GetProjectVariables>;

interface ListProjectsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProjectsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProjectsData, undefined>;
  operationName: string;
}
export const listProjectsRef: ListProjectsRef;

export function listProjects(options?: ExecuteQueryOptions): QueryPromise<ListProjectsData, undefined>;
export function listProjects(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProjectsData, undefined>;

interface CreateTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
  operationName: string;
}
export const createTaskRef: CreateTaskRef;

export function createTask(vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;
export function createTask(dc: DataConnect, vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface UpdateTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskVariables): MutationRef<UpdateTaskData, UpdateTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTaskVariables): MutationRef<UpdateTaskData, UpdateTaskVariables>;
  operationName: string;
}
export const updateTaskRef: UpdateTaskRef;

export function updateTask(vars: UpdateTaskVariables): MutationPromise<UpdateTaskData, UpdateTaskVariables>;
export function updateTask(dc: DataConnect, vars: UpdateTaskVariables): MutationPromise<UpdateTaskData, UpdateTaskVariables>;

interface DeleteTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
  operationName: string;
}
export const deleteTaskRef: DeleteTaskRef;

export function deleteTask(vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;
export function deleteTask(dc: DataConnect, vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

interface GetTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTaskVariables): QueryRef<GetTaskData, GetTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTaskVariables): QueryRef<GetTaskData, GetTaskVariables>;
  operationName: string;
}
export const getTaskRef: GetTaskRef;

export function getTask(vars: GetTaskVariables, options?: ExecuteQueryOptions): QueryPromise<GetTaskData, GetTaskVariables>;
export function getTask(dc: DataConnect, vars: GetTaskVariables, options?: ExecuteQueryOptions): QueryPromise<GetTaskData, GetTaskVariables>;

interface ListTasksRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTasksVariables): QueryRef<ListTasksData, ListTasksVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTasksVariables): QueryRef<ListTasksData, ListTasksVariables>;
  operationName: string;
}
export const listTasksRef: ListTasksRef;

export function listTasks(vars: ListTasksVariables, options?: ExecuteQueryOptions): QueryPromise<ListTasksData, ListTasksVariables>;
export function listTasks(dc: DataConnect, vars: ListTasksVariables, options?: ExecuteQueryOptions): QueryPromise<ListTasksData, ListTasksVariables>;

interface CreateProjectMemberRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProjectMemberVariables): MutationRef<CreateProjectMemberData, CreateProjectMemberVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProjectMemberVariables): MutationRef<CreateProjectMemberData, CreateProjectMemberVariables>;
  operationName: string;
}
export const createProjectMemberRef: CreateProjectMemberRef;

export function createProjectMember(vars: CreateProjectMemberVariables): MutationPromise<CreateProjectMemberData, CreateProjectMemberVariables>;
export function createProjectMember(dc: DataConnect, vars: CreateProjectMemberVariables): MutationPromise<CreateProjectMemberData, CreateProjectMemberVariables>;

interface DeleteProjectMemberRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProjectMemberVariables): MutationRef<DeleteProjectMemberData, DeleteProjectMemberVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProjectMemberVariables): MutationRef<DeleteProjectMemberData, DeleteProjectMemberVariables>;
  operationName: string;
}
export const deleteProjectMemberRef: DeleteProjectMemberRef;

export function deleteProjectMember(vars: DeleteProjectMemberVariables): MutationPromise<DeleteProjectMemberData, DeleteProjectMemberVariables>;
export function deleteProjectMember(dc: DataConnect, vars: DeleteProjectMemberVariables): MutationPromise<DeleteProjectMemberData, DeleteProjectMemberVariables>;

interface ListProjectMembersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProjectMembersVariables): QueryRef<ListProjectMembersData, ListProjectMembersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListProjectMembersVariables): QueryRef<ListProjectMembersData, ListProjectMembersVariables>;
  operationName: string;
}
export const listProjectMembersRef: ListProjectMembersRef;

export function listProjectMembers(vars: ListProjectMembersVariables, options?: ExecuteQueryOptions): QueryPromise<ListProjectMembersData, ListProjectMembersVariables>;
export function listProjectMembers(dc: DataConnect, vars: ListProjectMembersVariables, options?: ExecuteQueryOptions): QueryPromise<ListProjectMembersData, ListProjectMembersVariables>;

interface CreateCommentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCommentVariables): MutationRef<CreateCommentData, CreateCommentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCommentVariables): MutationRef<CreateCommentData, CreateCommentVariables>;
  operationName: string;
}
export const createCommentRef: CreateCommentRef;

export function createComment(vars: CreateCommentVariables): MutationPromise<CreateCommentData, CreateCommentVariables>;
export function createComment(dc: DataConnect, vars: CreateCommentVariables): MutationPromise<CreateCommentData, CreateCommentVariables>;

interface DeleteCommentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCommentVariables): MutationRef<DeleteCommentData, DeleteCommentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCommentVariables): MutationRef<DeleteCommentData, DeleteCommentVariables>;
  operationName: string;
}
export const deleteCommentRef: DeleteCommentRef;

export function deleteComment(vars: DeleteCommentVariables): MutationPromise<DeleteCommentData, DeleteCommentVariables>;
export function deleteComment(dc: DataConnect, vars: DeleteCommentVariables): MutationPromise<DeleteCommentData, DeleteCommentVariables>;

interface ListCommentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCommentsVariables): QueryRef<ListCommentsData, ListCommentsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCommentsVariables): QueryRef<ListCommentsData, ListCommentsVariables>;
  operationName: string;
}
export const listCommentsRef: ListCommentsRef;

export function listComments(vars: ListCommentsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCommentsData, ListCommentsVariables>;
export function listComments(dc: DataConnect, vars: ListCommentsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCommentsData, ListCommentsVariables>;

