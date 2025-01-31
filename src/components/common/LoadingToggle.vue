<template>
	<div class='loading-toggle'>
		<div class='circle'></div>
		<LoadingBar
			size='medium'
			tall
		/>
	</div>
</template>

<script>
export default
{
	name: 'LoadingToggle',
}
</script>

<style scoped lang="less">

	.loading-toggle {
		display: flex;
		flex-direction: row;
		justify-content: left;
		align-items: center;
		margin-bottom: 20px;

		.loading-bar {
			margin: 0 0 0 15px;
		}

		.circle {
			position: relative;
			overflow: hidden;
			margin-right: 0 !important;
			height: 32px;
			width: 32px;
			border-radius: 50%;
			border: 1px solid green;
			background: rgba(0, 178, 7, .18); /* quite pale green */

			/* Imported from loading.less */
			.loading-background();

			&:after {
				opacity: .25;
			}
		}
	}

@-webkit-keyframes bg-fade {
		0%{background-position-x:0%}
		100%{background-position-x:-100%}
}

.loading-background()
{
	position: relative;
	text-align: left;

	&:after{
		animation: bg-fade 1s linear infinite;
		background: linear-gradient(to right,
			rgba(255,255,255,.25) 0%,
			rgba(255,255,255,.25) 1%,
			rgba(255,255,255,0) 15%,
			rgba(255,255,255,.25) 50%,
			rgba(255,255,255,0) 65%,
			rgba(255,255,255,.25) 100%);
		background-size: 200% 200%;
		content: "";
		height: 100%;
		position: absolute;
		width: 100%;
	}
}

</style>
