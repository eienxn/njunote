// backend/src/dao/postDAO.ts
// THIS IS A PLACEHOLDER IMPLEMENTATION TO FAIL THE TESTS (RED)

export const createPost = async (userId: number, content: string): Promise<any> => {
    throw new Error('Not implemented');
  };

  export const findPostById = async (postId: number, includeDeleted = false): Promise<any> => {
    throw new Error('Not implemented');
  };

  export const deletePostById = async (postId: number): Promise<void> => {
    throw new Error('Not implemented');
  };

  export const addImageToPost = async (postId: number, imageUrl: string, displayOrder: number): Promise<any> => {
    throw new Error('Not implemented');
  };
