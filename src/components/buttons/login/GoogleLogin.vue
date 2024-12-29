<template>
	<SocialLogin provider="google" />
</template>

<script>
import SocialLogin from "@/components/buttons/login/SocialLogin.vue"

export default {
	name: "GoogleLogin",
	components: {
		SocialLogin,
	},
}
</script>
