{   
    //method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    //call the create comment class
                    new PostComments(data.data.post._id);

                    //enable the functionality of the toggle like button on the new post

                    new toggleLike($(' .toggle-like-button', newPost));

                    new Noty
                    ({
                        theme: 'relax',
                        text: 'Post published',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    //method to create a post in DOM

    let newPostDom = function(post){
        //show the count of zero likes on this post
        return $(`<li class="each-post" id="post-${ post._id }">
            <p class="each-post-text">

                            <small class="small-delete">
                                <a class="delete-post-button" href="/posts/destroy/${ post.id}" >X</a> 
                            </small>
                
                        <div class="post-user">
                                <div><img src="${post.user.avatar}" alt="${post.user.name}" width="100"></div>
                            <span>
                                <p class="post-user-name"> ${post.user.name} </p>
                                <p class="post-timing">Timing of Post</p>
                            </span>
                        </div>
                        
                        <p class="post-content">${post.content }</p>

                            <small>
                            <i class="fa-solid fa-heart"></i>
                                <a class="toggle-like-button" data-likes="${post.likes.length}" href="/likes/toggle/?id=${post._id}&type=Post">${post.likes.length} Likes
                                </a>
                                ${ post.likes.length } Likes

                            </small>
                    
            </p>
            <div class="post-comments">

            
                    <form id="post-${post._id}-comments-form" action="/comments/create" class="comment-form" method="POST">
                        <input type="text" name="content" placeholder="Type here to add comment..." required>
                        <input type="hidden" name="post" value="${ post._id }">
                        <input type="submit" value="Add Comment" style="font-weight:bold; background-color: rgba(128,128,128,0.461);"/>
                    </form>


                        <div class="post-comments-list">
                            <ul id="post-comments-${ post._id  }">
                                
                            </ul>
                        </div>
            </div>
        </li>`)
    }

    

    //method to delete a post from DOM
    let deletePost = function(deleteLink)
    {
        $(deleteLink).click(function(event)
        {
            event.preventDefault();

            $.ajax({
                type:'get',
                url: $(deleteLink).prop('href'),
                success : function(data)
                {
                    $(`#post-${data.data.post_id}`).remove();

                    new Noty
                    ({
                        theme: 'relax',
                        text: 'Post Deleted',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error : function(error)
                {
                    console.log(error.responseText);
                }
            });
        });
    }

      // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
      let convertPostsToAjax = function()
      {
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute

            let postId = self.prop('id').split("-")[1];

            new PostComments(postID);
        });
      }
    createPost();
    convertPostsToAjax();
}