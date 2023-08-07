import UserAvatar from "@/components/UserAvatar";
import TopCommentDTO from "@/models/comment/TopCommentDTO.model";
import useLogin from "@/stores/useLogin";
import fromNow from "@/utils/fromNow";
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import CommentBox, { CommentBoxHandler } from "./CommentBox";
import useArticleView from "@/stores/useArticleView";

/**
 * 文章评论区
 */
export function CommentsSection() {
	const comments = useArticleView((state) => state.comments);
	return (
		<div className='px-10'>
			<h1 className='font-black text-2xl'>评论</h1>
			<ArticleCommentBox />
			{comments ? <CommentsList comments={comments} /> : null}
		</div>
	);
}

/**
 * 主评论框
 */
function ArticleCommentBox() {
	const userInfo = useLogin((state) => state.userInfo);
	const articleId = useArticleView((state) => state.articleId);
	return (
		<div className='flex w-full gap-4 py-4'>
			<div>
				<UserAvatar
					src={
						userInfo ? userInfo.photo : "/images/initial-avatar.jpg"
					}
					size='mid'
				/>
			</div>
			{userInfo ? (
				<CommentBox />
			) : (
				<div className='textarea bg-slate-100 w-full h-16 flex justify-center items-center text-slate-500 resize-none'>
					未登录，请先{" "}
					<a className='text-primary cursor-pointer' href='/login'>
						登录
					</a>
				</div>
			)}
		</div>
	);
}

type CommentsListProp = {
	comments: TopCommentDTO[];
};
/**
 * 文章评论列表
 */
export function CommentsList({ comments }: CommentsListProp) {
	return (
		<div className='w-full'>
			<h1 className='font-black text-2xl'>全部评论 {comments.length}</h1>
			{comments.map((comment) => (
				<CommentItem key={comment.commentId} comment={comment} />
			))}
		</div>
	);
}

type SubCommitsListProp = {
	subComments: CommentsListProp["comments"][number]["childComments"];
};
/**
 * 文章子评论列表
 */
export function SubCommitsList({
	subComments: subCommits,
}: SubCommitsListProp) {
	return (
		<div className='bg-slate-50 px-2 py-4 mt-4'>
			{subCommits.map((subComment) => (
				<CommentItem key={subComment.commentId} comment={subComment} />
			))}
		</div>
	);
}

type CommentItemProp = {
	comment:
		| CommentsListProp["comments"][number]
		| CommentsListProp["comments"][number]["childComments"][number];
};
/**
 * 文章评论项
 */
export function CommentItem({ comment }: CommentItemProp) {
	const isTopComment =
		"commentCount" in comment && "childComments" in comment;
	return (
		<div
			className={`flex gap-4 ${
				isTopComment ? "py-4" : "mt-8  first-of-type:mt-0"
			}`}
		>
			<div>
				<UserAvatar src={comment.userPhoto} size='mid' />
			</div>
			<div className='w-full'>
				<CommentItemBaseInfo comment={comment} />
				<div className='my-2'>{comment.commentContent}</div>
				<CommentItemActive comment={comment} />
				<CommentItemReference comment={comment} />
			</div>
		</div>
	);
}

/**
 * 文章评论基础信息（用户名、发送时间）
 */
function CommentItemBaseInfo({ comment }: CommentItemProp) {
	return (
		<div className='flex justify-between'>
			{/* 用户名 */}
			<div className='font-black'>{comment.userName}</div>
			{/* 距今时间 */}
			<div className='text-slate-500'>{fromNow(comment.commentTime)}</div>
		</div>
	);
}

/**
 * 文章评论互动区（点赞、回复）
 */
function CommentItemActive({ comment }: CommentItemProp) {
	const isTopComment =
		"commentCount" in comment && "childComments" in comment;
	// 评论框可见性
	const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false);
	const commentBoxRef = useRef<CommentBoxHandler>(null);
	/** 打开评论区 */
	const openCommentBox: React.MouseEventHandler<HTMLSpanElement> = () => {
		setCommentBoxVisible((v) => !v);
	};
	useEffect(() => {
		if (commentBoxVisible) commentBoxRef.current?.focus();
	}, [commentBoxVisible]);
	return (
		<div className='font-black'>
			<span
				className={`hover:text-primary-focus  cursor-pointer ${
					comment.praised ? "text-primary-focus" : ""
				}`}
			>
				点赞 {comment.praiseCount}
			</span>
			<span
				className='hover:text-primary-focus cursor-pointer ml-4'
				onClick={openCommentBox}
			>
				{commentBoxVisible
					? "取消评论"
					: "评论" + (isTopComment ? comment.commentCount : "")}
			</span>
			<span className='hover:text-primary-focus cursor-pointer ml-4'>
				更多
			</span>
			<CommentBox visible={commentBoxVisible} ref={commentBoxRef} />
		</div>
	);
}

/**
 * 文章评论引用区（子评论、回复评论）
 */
function CommentItemReference({ comment }: CommentItemProp) {
	const isTopComment =
		"commentCount" in comment && "childComments" in comment;
	if (isTopComment && comment.childComments.length > 0) {
		return <SubCommitsList subComments={comment.childComments} />;
	} else if (!isTopComment && comment.parentContent) {
		return (
			<div className='px-3 mt-2 bg-base-200'>{comment.parentContent}</div>
		);
	}
	return null;
}