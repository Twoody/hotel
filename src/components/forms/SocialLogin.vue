User should be able to register/login from multiple places
<template>
	<div class="social-login-wrapper">
		<GoogleLogin>
			or login with Google
		</GoogleLogin>
		<FacebookLogin>
			or login with Google
		</FacebookLogin>
	</div>
</template>

<script>
import FacebookLogin from "@/components/buttons/login/FacebookLogin"
import GoogleLogin from "@/components/buttons/login/GoogleLogin"

export default {
	name: "SocialLogin",
	components: 
	{
		FacebookLogin,
		GoogleLogin,
	},
}
</script>

<style lang='less'>
.social-login-wrapper {
	.social-button {
		background: white;
		border: 0;
		border-radius: 100%;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0,2);
		outline: 0;
		padding: 10px;
		width: 75px;
		.svg-wrapper {
			height: 100%;
			width: 100%;
		}
	}
	.social-button:active {
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
		display: relative;
	}
	.social-button img {
		width: 100%;
	}
}
</style>
