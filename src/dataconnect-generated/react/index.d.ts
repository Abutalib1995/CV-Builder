import { CreateUserData, UpdateUserData, UpdateUserVariables, GetUserData, CreateProjectData, CreateProjectVariables, UpdateProjectData, UpdateProjectVariables, DeleteProjectData, DeleteProjectVariables, GetProjectData, GetProjectVariables, ListProjectsData, CreateTaskData, CreateTaskVariables, UpdateTaskData, UpdateTaskVariables, DeleteTaskData, DeleteTaskVariables, GetTaskData, GetTaskVariables, ListTasksData, ListTasksVariables, CreateProjectMemberData, CreateProjectMemberVariables, DeleteProjectMemberData, DeleteProjectMemberVariables, ListProjectMembersData, ListProjectMembersVariables, CreateCommentData, CreateCommentVariables, DeleteCommentData, DeleteCommentVariables, ListCommentsData, ListCommentsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useUpdateUser(options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;
export function useUpdateUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;

export function useGetUser(options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;
export function useGetUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;

export function useCreateProject(options?: useDataConnectMutationOptions<CreateProjectData, FirebaseError, CreateProjectVariables>): UseDataConnectMutationResult<CreateProjectData, CreateProjectVariables>;
export function useCreateProject(dc: DataConnect, options?: useDataConnectMutationOptions<CreateProjectData, FirebaseError, CreateProjectVariables>): UseDataConnectMutationResult<CreateProjectData, CreateProjectVariables>;

export function useUpdateProject(options?: useDataConnectMutationOptions<UpdateProjectData, FirebaseError, UpdateProjectVariables>): UseDataConnectMutationResult<UpdateProjectData, UpdateProjectVariables>;
export function useUpdateProject(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateProjectData, FirebaseError, UpdateProjectVariables>): UseDataConnectMutationResult<UpdateProjectData, UpdateProjectVariables>;

export function useDeleteProject(options?: useDataConnectMutationOptions<DeleteProjectData, FirebaseError, DeleteProjectVariables>): UseDataConnectMutationResult<DeleteProjectData, DeleteProjectVariables>;
export function useDeleteProject(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteProjectData, FirebaseError, DeleteProjectVariables>): UseDataConnectMutationResult<DeleteProjectData, DeleteProjectVariables>;

export function useGetProject(vars: GetProjectVariables, options?: useDataConnectQueryOptions<GetProjectData>): UseDataConnectQueryResult<GetProjectData, GetProjectVariables>;
export function useGetProject(dc: DataConnect, vars: GetProjectVariables, options?: useDataConnectQueryOptions<GetProjectData>): UseDataConnectQueryResult<GetProjectData, GetProjectVariables>;

export function useListProjects(options?: useDataConnectQueryOptions<ListProjectsData>): UseDataConnectQueryResult<ListProjectsData, undefined>;
export function useListProjects(dc: DataConnect, options?: useDataConnectQueryOptions<ListProjectsData>): UseDataConnectQueryResult<ListProjectsData, undefined>;

export function useCreateTask(options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;
export function useCreateTask(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;

export function useUpdateTask(options?: useDataConnectMutationOptions<UpdateTaskData, FirebaseError, UpdateTaskVariables>): UseDataConnectMutationResult<UpdateTaskData, UpdateTaskVariables>;
export function useUpdateTask(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTaskData, FirebaseError, UpdateTaskVariables>): UseDataConnectMutationResult<UpdateTaskData, UpdateTaskVariables>;

export function useDeleteTask(options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;
export function useDeleteTask(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;

export function useGetTask(vars: GetTaskVariables, options?: useDataConnectQueryOptions<GetTaskData>): UseDataConnectQueryResult<GetTaskData, GetTaskVariables>;
export function useGetTask(dc: DataConnect, vars: GetTaskVariables, options?: useDataConnectQueryOptions<GetTaskData>): UseDataConnectQueryResult<GetTaskData, GetTaskVariables>;

export function useListTasks(vars: ListTasksVariables, options?: useDataConnectQueryOptions<ListTasksData>): UseDataConnectQueryResult<ListTasksData, ListTasksVariables>;
export function useListTasks(dc: DataConnect, vars: ListTasksVariables, options?: useDataConnectQueryOptions<ListTasksData>): UseDataConnectQueryResult<ListTasksData, ListTasksVariables>;

export function useCreateProjectMember(options?: useDataConnectMutationOptions<CreateProjectMemberData, FirebaseError, CreateProjectMemberVariables>): UseDataConnectMutationResult<CreateProjectMemberData, CreateProjectMemberVariables>;
export function useCreateProjectMember(dc: DataConnect, options?: useDataConnectMutationOptions<CreateProjectMemberData, FirebaseError, CreateProjectMemberVariables>): UseDataConnectMutationResult<CreateProjectMemberData, CreateProjectMemberVariables>;

export function useDeleteProjectMember(options?: useDataConnectMutationOptions<DeleteProjectMemberData, FirebaseError, DeleteProjectMemberVariables>): UseDataConnectMutationResult<DeleteProjectMemberData, DeleteProjectMemberVariables>;
export function useDeleteProjectMember(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteProjectMemberData, FirebaseError, DeleteProjectMemberVariables>): UseDataConnectMutationResult<DeleteProjectMemberData, DeleteProjectMemberVariables>;

export function useListProjectMembers(vars: ListProjectMembersVariables, options?: useDataConnectQueryOptions<ListProjectMembersData>): UseDataConnectQueryResult<ListProjectMembersData, ListProjectMembersVariables>;
export function useListProjectMembers(dc: DataConnect, vars: ListProjectMembersVariables, options?: useDataConnectQueryOptions<ListProjectMembersData>): UseDataConnectQueryResult<ListProjectMembersData, ListProjectMembersVariables>;

export function useCreateComment(options?: useDataConnectMutationOptions<CreateCommentData, FirebaseError, CreateCommentVariables>): UseDataConnectMutationResult<CreateCommentData, CreateCommentVariables>;
export function useCreateComment(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCommentData, FirebaseError, CreateCommentVariables>): UseDataConnectMutationResult<CreateCommentData, CreateCommentVariables>;

export function useDeleteComment(options?: useDataConnectMutationOptions<DeleteCommentData, FirebaseError, DeleteCommentVariables>): UseDataConnectMutationResult<DeleteCommentData, DeleteCommentVariables>;
export function useDeleteComment(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCommentData, FirebaseError, DeleteCommentVariables>): UseDataConnectMutationResult<DeleteCommentData, DeleteCommentVariables>;

export function useListComments(vars: ListCommentsVariables, options?: useDataConnectQueryOptions<ListCommentsData>): UseDataConnectQueryResult<ListCommentsData, ListCommentsVariables>;
export function useListComments(dc: DataConnect, vars: ListCommentsVariables, options?: useDataConnectQueryOptions<ListCommentsData>): UseDataConnectQueryResult<ListCommentsData, ListCommentsVariables>;
